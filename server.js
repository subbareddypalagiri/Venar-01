const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { encryptPayload, decryptPayload, encodeStatelessKey, decodeStatelessKey } = require('./crypto-utils');
const { generateProject, listProjects, PROJECTS_DIR } = require('./agent-engine');

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

// Serve frontend UI and local projects workspace
app.use(express.static(path.join(__dirname, 'public')));
app.use('/projects', express.static(PROJECTS_DIR));

// Persistent database of user virtual keys mapped to their encrypted provider keys
const KEYS_FILE = process.env.VERCEL
  ? path.join('/tmp', 'keys.json')
  : path.join(__dirname, 'keys.json');
let keysDatabase = {};

try {
  if (fs.existsSync(KEYS_FILE)) {
    keysDatabase = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
    console.log(`[Storage] Loaded ${Object.keys(keysDatabase).length} encrypted virtual keys from disk.`);
  }
} catch (e) {
  console.error('[Storage] Error reading keys.json:', e);
  keysDatabase = {};
}

function persistKeys() {
  fs.writeFile(KEYS_FILE, JSON.stringify(keysDatabase, null, 2), (err) => {
    if (err) console.error('[Storage] Failed to save keys.json:', err);
  });
}

const cooldowns = {}; // Rate limit tracking: { "provider_key": timestamp }

// Live Mission Control Metrics
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTokensEstimated: 0,
  totalCostSavedUSD: 0.0,
  providerStats: {}
};

// Universal Provider Configuration Map
const PROVIDER_ENDPOINTS = {
  openrouter: { url: 'https://openrouter.ai/api/v1/chat/completions', type: 'openai', name: 'OpenRouter' },
  groq: { url: 'https://api.groq.com/openai/v1/chat/completions', type: 'openai', name: 'Groq Cloud' },
  cerebras: { url: 'https://api.cerebras.ai/v1/chat/completions', type: 'openai', name: 'Cerebras' },
  openai: { url: 'https://api.openai.com/v1/chat/completions', type: 'openai', name: 'OpenAI' },
  huggingface: { url: 'https://router.huggingface.co/hf-inference/v1/chat/completions', type: 'openai', name: 'Hugging Face' },
  together: { url: 'https://api.together.xyz/v1/chat/completions', type: 'openai', name: 'Together AI' },
  siliconflow: { url: 'https://api.siliconflow.cn/v1/chat/completions', type: 'openai', name: 'SiliconFlow' },
  deepinfra: { url: 'https://api.deepinfra.com/v1/openai/chat/completions', type: 'openai', name: 'DeepInfra' },
  fireworks: { url: 'https://api.fireworks.ai/inference/v1/chat/completions', type: 'openai', name: 'Fireworks AI' },
  novita: { url: 'https://api.novita.ai/v3/openai/chat/completions', type: 'openai', name: 'Novita AI' },
  perplexity: { url: 'https://api.perplexity.ai/chat/completions', type: 'openai', name: 'Perplexity' },
  mistral: { url: 'https://api.mistral.ai/v1/chat/completions', type: 'openai', name: 'Mistral AI' },
  nvidia: { url: 'https://integrate.api.nvidia.com/v1/chat/completions', type: 'openai', name: 'NVIDIA NIM' },
  ai21: { url: 'https://api.ai21.com/studio/v1/chat/completions', type: 'openai', name: 'AI21 Labs' },
  gemini: { url: 'https://generativelanguage.googleapis.com/v1beta/models/', type: 'gemini', name: 'Google Gemini' },
  cohere: { url: 'https://api.cohere.com/v1/chat', type: 'cohere', name: 'Cohere' },
  anthropic: { url: 'https://api.anthropic.com/v1/messages', type: 'anthropic', name: 'Anthropic Claude' },
  github: { url: 'https://models.inference.ai.azure.com/chat/completions', type: 'openai', name: 'GitHub Models (Azure)' }
};

// Initialize metrics map for providers
Object.keys(PROVIDER_ENDPOINTS).forEach(k => {
  metrics.providerStats[k] = { requests: 0, successes: 0, failures: 0, lastLatencyMs: 0 };
});

// Import Exhaustive 85+ Verified Free Model Registry & Cascade Architectures
const { MODEL_CATALOG, SYSTEM_MODELS } = require('./models-catalog');

// Dynamic Live Auto-Discovery Engine (Synchronizes live free models from OpenRouter/HuggingFace)
let dynamicLiveModels = [];
let lastSyncTimestamp = 0;

async function syncLiveFreeModels() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models');
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    if (!data || !Array.isArray(data.data)) return { success: false, error: "Invalid response" };

    const liveFree = data.data.filter(m => 
      m.id && (
        m.id.endsWith(':free') || 
        (m.pricing && m.pricing.prompt === "0" && m.pricing.completion === "0")
      )
    );

    let newlyDiscovered = 0;
    liveFree.forEach(m => {
      // Check if already in static catalog or dynamic
      const existing = MODEL_CATALOG.find(c => 
        c.routes.some(r => r.p === 'openrouter' && r.m === m.id) ||
        c.id === m.id.replace(':free', '').split('/').pop()
      );

      if (!existing && !dynamicLiveModels.some(d => d.id === m.id)) {
        const familyName = m.id.split('/')[0] || 'Community';
        const formattedFamily = familyName.charAt(0).toUpperCase() + familyName.slice(1);
        const name = m.name || m.id.split('/')[1] || m.id;
        
        dynamicLiveModels.push({
          id: m.id,
          name: name,
          family: formattedFamily,
          badge: '✨ Live Free Sync',
          context: m.context_length ? `${Math.round(m.context_length / 1000)}K` : '32K',
          speed: '~120 t/s',
          tags: ['free', 'live', 'openrouter'],
          desc: m.description ? m.description.slice(0, 180) + '...' : `Live free model auto-discovered from OpenRouter network.`,
          isDynamic: true,
          routes: [
            { p: 'openrouter', m: m.id, free: true, label: 'OpenRouter (Live Free)' }
          ]
        });
        newlyDiscovered++;
      }
    });

    lastSyncTimestamp = Date.now();
    console.log(`[LiveSync] Polled ${liveFree.length} live free models (+${newlyDiscovered} new). Total catalog: ${MODEL_CATALOG.length + dynamicLiveModels.length}`);
    return {
      success: true,
      totalLiveFree: liveFree.length,
      newlyDiscovered,
      staticCount: MODEL_CATALOG.length,
      dynamicCount: dynamicLiveModels.length,
      totalCombined: MODEL_CATALOG.length + dynamicLiveModels.length,
      lastSync: lastSyncTimestamp
    };
  } catch (err) {
    console.error("[LiveSync] Error polling free models:", err.message);
    return { success: false, error: err.message };
  }
}

// Background live sync
setTimeout(() => {
  syncLiveFreeModels().catch(() => {});
}, 1500);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/projects', express.static(PROJECTS_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration Endpoint (with Stateless Self-Contained AES-256-GCM Tokens)
app.post('/api/register-keys', (req, res) => {
  const { keys, preferredOrder, ...directPayload } = req.body;
  const rawKeys = keys || directPayload;

  if (!rawKeys || Object.keys(rawKeys).length === 0) {
    return res.status(400).json({ error: "No keys provided!" });
  }

  // Generate self-contained stateless encrypted virtual key
  const virtualKey = encodeStatelessKey(rawKeys, preferredOrder);
  
  // Also register in memory/disk cache for server-side metrics
  const encrypted = encryptPayload(rawKeys);
  keysDatabase[virtualKey] = {
    ...encrypted,
    preferredOrder: Array.isArray(preferredOrder) ? preferredOrder : [],
    created: Date.now()
  };
  persistKeys();

  const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : req.protocol);
  res.json({
    success: true,
    virtualKey: virtualKey,
    endpoint: `${proto}://${req.get('host')}/v1/chat/completions`
  });
});

// 1-Click Provider Key Health Auditor Endpoint
app.post('/api/verify-provider-key', async (req, res) => {
  const { provider, key } = req.body;
  if (!provider || !key) {
    return res.status(400).json({ valid: false, error: "Provider and key required" });
  }

  const cleanKey = key.trim();
  const config = PROVIDER_ENDPOINTS[provider];
  if (!config) {
    return res.status(400).json({ valid: false, error: "Unknown provider: " + provider });
  }

  const startTime = Date.now();
  try {
    if (provider === 'gemini') {
      let r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
      });
      let verifiedModel = 'gemini-2.5-flash';
      if (!r.ok) {
        r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
        });
        verifiedModel = 'gemini-1.5-flash';
      }
      const latencyMs = Date.now() - startTime;
      if (r.ok) return res.json({ valid: true, provider, latencyMs, model: verifiedModel });
      const err = await r.json().catch(() => ({}));
      return res.status(400).json({ valid: false, error: err.error?.message || `HTTP ${r.status}` });
    }

    if (provider === 'github') {
      const r = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${cleanKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 })
      });
      const latencyMs = Date.now() - startTime;
      if (r.ok) return res.json({ valid: true, provider, latencyMs, model: 'gpt-4o-mini' });
      const err = await r.json().catch(() => ({}));
      return res.status(400).json({ valid: false, error: err.error?.message || `HTTP ${r.status}` });
    }

    if (config.type === 'openai') {
      let testModel = 'llama-3.1-8b-instant';
      if (provider === 'cerebras') testModel = 'llama3.1-8b';
      else if (provider === 'openrouter') testModel = 'meta-llama/llama-3.3-70b-instruct:free';
      else if (provider === 'openai') testModel = 'gpt-4o-mini';
      else if (provider === 'together') testModel = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo';
      else if (provider === 'siliconflow') testModel = 'Qwen/Qwen2.5-7B-Instruct';
      else if (provider === 'deepinfra') testModel = 'meta-llama/Meta-Llama-3.1-8B-Instruct';
      else if (provider === 'mistral') testModel = 'open-mistral-7b';

      const r = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://venar.ai',
          'X-Title': 'Venar Ping'
        },
        body: JSON.stringify({ model: testModel, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 })
      });
      const latencyMs = Date.now() - startTime;
      if (r.ok) return res.json({ valid: true, provider, latencyMs, model: testModel });
      const err = await r.json().catch(() => ({}));
      return res.status(400).json({ valid: false, error: err.error?.message || `HTTP ${r.status}` });
    }

    if (provider === 'cohere') {
      const r = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${cleanKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ping', max_tokens: 1 })
      });
      const latencyMs = Date.now() - startTime;
      if (r.ok) return res.json({ valid: true, provider, latencyMs, model: 'command-r' });
      return res.status(400).json({ valid: false, error: `HTTP ${r.status}` });
    }

    if (provider === 'anthropic') {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': cleanKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-3-5-haiku-20241022', messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 })
      });
      const latencyMs = Date.now() - startTime;
      if (r.ok) return res.json({ valid: true, provider, latencyMs, model: 'claude-3-5-haiku' });
      return res.status(400).json({ valid: false, error: `HTTP ${r.status}` });
    }

    return res.json({ valid: true, provider, latencyMs: Date.now() - startTime });
  } catch (e) {
    return res.status(500).json({ valid: false, error: e.message || "Ping network timeout" });
  }
});

// Live Mission-Control Health & Stats Endpoint
app.get('/api/health-stats', (req, res) => {
  const activeCooldowns = {};
  const now = Date.now();
  for (const [k, exp] of Object.entries(cooldowns)) {
    if (exp > now) {
      activeCooldowns[k] = Math.ceil((exp - now) / 1000);
    }
  }

  const combined = [...MODEL_CATALOG, ...dynamicLiveModels];
  res.json({
    metrics,
    cooldowns: activeCooldowns,
    providersCount: Object.keys(PROVIDER_ENDPOINTS).length,
    registeredKeysCount: Object.keys(keysDatabase).length,
    catalogModelsCount: combined.length,
    staticModelsCount: MODEL_CATALOG.length,
    dynamicModelsCount: dynamicLiveModels.length,
    lastLiveSync: lastSyncTimestamp
  });
});

// Live Sync Trigger Endpoint
app.get('/api/models/live-sync', async (req, res) => {
  const result = await syncLiveFreeModels();
  res.json(result);
});

// Full Model Catalog Endpoint (Universal Studio Style)
app.get('/api/models', (req, res) => {
  const combined = [...MODEL_CATALOG, ...dynamicLiveModels];
  res.json({
    total: combined.length,
    staticCount: MODEL_CATALOG.length,
    dynamicCount: dynamicLiveModels.length,
    lastSync: lastSyncTimestamp,
    models: combined
  });
});

// OpenAI-Compatible List Models Endpoint (for Cursor, Cline, LibreChat)
app.get('/v1/models', (req, res) => {
  const combined = [...MODEL_CATALOG, ...dynamicLiveModels];
  res.json({
    object: "list",
    data: combined.map(m => ({
      id: m.id,
      object: "model",
      created: 1700000000,
      owned_by: m.family.toLowerCase(),
      permission: [],
      root: m.id,
      parent: null
    }))
  });
});

// Auto-sync client keys to local ~/.venar/keys.json (Zero CLI friction)
app.post('/api/sync-local-keys', (req, res) => {
  try {
    const keys = req.body.keys || {};
    const venarDir = path.join(os.homedir(), '.venar');
    if (!fs.existsSync(venarDir)) fs.mkdirSync(venarDir, { recursive: true });
    const keysPath = path.join(venarDir, 'keys.json');
    let existing = {};
    if (fs.existsSync(keysPath)) {
      try { existing = JSON.parse(fs.readFileSync(keysPath, 'utf8')); } catch (e) {}
    }
    const merged = { ...existing, ...keys };
    fs.writeFileSync(keysPath, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`[LocalSync] Synced ${Object.keys(keys).length} keys to ${keysPath}`);
    res.json({ success: true, count: Object.keys(merged).length, path: keysPath });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1-Click Launcher Download for Windows
app.get('/api/download-launcher', (req, res) => {
  const batScript = `@echo off
title VENAR Code - Autonomous Local AI Coding Agent
color 0E
echo ==============================================================================
echo   VENAR CODE : Autonomous Local AI Coding Agent (Claude Code Style)
echo ==============================================================================
echo Connecting to local VENAR Gateway on port 8080...
set VENAR_GATEWAY_URL=http://localhost:8080/v1/chat/completions
where venar >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    venar
) else (
    node "%~dp0venar-cli.js"
)
pause
`;
  res.setHeader('Content-Type', 'application/x-bat');
  res.setHeader('Content-Disposition', 'attachment; filename="venar-launcher.bat"');
  res.send(batScript);
});

// ==========================================
// AUTONOMOUS LOCAL CODE AGENT API (OPTION B)
// ==========================================
app.get('/api/agent/projects', (req, res) => {
  res.json({ success: true, projects: listProjects() });
});

app.post('/api/agent/generate-project', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const { prompt, projectName, techStack, userKeys } = req.body;
  if (!prompt || !prompt.trim()) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Project prompt is required.' })}\n\n`);
    res.end();
    return;
  }

  const PORT = process.env.PORT || 8080;

  try {
    await generateProject({
      prompt,
      projectName,
      techStack: techStack || 'html-tailwind',
      userKeys: userKeys || {},
      port: PORT,
      onProgress: (evt) => {
        res.write(`data: ${JSON.stringify(evt)}\n\n`);
      }
    });
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    res.end();
  }
});

// Prompt categorization engine
function determineCategory(messages) {
  if (!messages || messages.length === 0) return 'general';
  const lastMsg = messages[messages.length - 1].content.toLowerCase();
  if (['code', 'python', 'javascript', 'html', 'css', 'function', 'bug', 'compile', 'sql', 'api', 'regex'].some(k => lastMsg.includes(k))) return 'coding';
  if (['explain', 'why', 'solve', 'calculate', 'prove', 'math', 'logical', 'reason', 'analyze'].some(k => lastMsg.includes(k))) return 'reasoning';
  return 'general';
}

function startCooldown(key, seconds = 60) {
  cooldowns[key] = Date.now() + (seconds * 1000);
}

function isCoolingDown(key) {
  if (!key) return true;
  if (cooldowns[key] && Date.now() < cooldowns[key]) return true;
  delete cooldowns[key];
  return false;
}

// Unified Completions Endpoint (Supports both Streaming SSE and Static JSON)
app.post('/v1/chat/completions', async (req, res) => {
  metrics.totalRequests++;
  const startTime = Date.now();

  const authHeader = req.headers.authorization;
  const rawToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

  let userKeys = null;
  let preferredOrder = [];

  // 1. Decrypt stateless self-contained token (Zero database dependency, cold-start proof)
  if (rawToken) {
    const stateless = decodeStatelessKey(rawToken);
    if (stateless && stateless.keys && Object.keys(stateless.keys).length > 0) {
      userKeys = stateless.keys;
      preferredOrder = stateless.preferredOrder || [];
    } else {
      // 2. Fall back to in-memory/disk database for legacy sk-merged- keys
      const storedRecord = keysDatabase[rawToken];
      if (storedRecord) {
        userKeys = decryptPayload(storedRecord);
        preferredOrder = storedRecord.preferredOrder || [];
      }
    }
  }

  // 3. Fallback: check x-venar-client-keys header (auto-passed from browser session)
  if ((!userKeys || Object.keys(userKeys).length === 0) && req.headers['x-venar-client-keys']) {
    try {
      userKeys = JSON.parse(decodeURIComponent(req.headers['x-venar-client-keys']));
    } catch (e) {}
  }

  // 3b. Local User Config (~/.venar/keys.json)
  if (!userKeys || Object.keys(userKeys).length === 0) {
    try {
      const userCfgPath = path.join(os.homedir(), '.venar', 'keys.json');
      if (fs.existsSync(userCfgPath)) {
        const fileContent = JSON.parse(fs.readFileSync(userCfgPath, 'utf8'));
        if (fileContent && typeof fileContent === 'object') {
          userKeys = fileContent;
        }
      }
    } catch (e) {}
  }

  // 4. Demo Fallback: check if server environment has shared sandbox keys
  if (!userKeys || Object.keys(userKeys).length === 0) {
    const demo = {};
    if (process.env.GROQ_API_KEY) demo.groq = process.env.GROQ_API_KEY;
    if (process.env.GEMINI_API_KEY) demo.gemini = process.env.GEMINI_API_KEY;
    if (process.env.GITHUB_TOKEN) demo.github = process.env.GITHUB_TOKEN;
    if (process.env.OPENROUTER_API_KEY) demo.openrouter = process.env.OPENROUTER_API_KEY;
    if (process.env.MISTRAL_API_KEY) demo.mistral = process.env.MISTRAL_API_KEY;
    if (process.env.CEREBRAS_API_KEY) demo.cerebras = process.env.CEREBRAS_API_KEY;
    if (Object.keys(demo).length > 0) {
      userKeys = demo;
    }
  }

  // 5. Saved Local Keys Fallback: check keysDatabase on disk (skipping mock/test placeholders)
  if (!userKeys || Object.keys(userKeys).length === 0) {
    const registered = Object.values(keysDatabase);
    for (const rec of registered) {
      if (rec) {
        const dec = decryptPayload(rec);
        if (dec && Object.keys(dec).length > 0) {
          const cleaned = {};
          for (const [k, v] of Object.entries(dec)) {
            if (typeof v === 'string' && !v.toLowerCase().includes('test1234') && !v.toLowerCase().includes('mock')) {
              cleaned[k] = v;
            }
          }
          if (Object.keys(cleaned).length > 0) {
            userKeys = cleaned;
            if (!preferredOrder.length && rec.preferredOrder) preferredOrder = rec.preferredOrder;
            break;
          }
        }
      }
    }
  }

  if (!userKeys || Object.keys(userKeys).length === 0) {
    return res.status(401).json({
      error: "No active API keys found!",
      reasons: [
        "Please paste at least one free API key (Groq, Google AI Studio, GitHub PAT, etc.) in the marketplace above.",
        "Your keys are encrypted directly in your browser session for maximum security."
      ]
    });
  }

  const { messages, model: requestedModel, stream = false, max_tokens, temperature, mode = 'auto', provider: pinnedProvider } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request. Messages array required." });
  }

  const effectiveMaxTokens = parseInt(max_tokens) || 2048;
  const effectiveTemperature = typeof temperature === 'number' ? temperature : 0.7;
  const effectiveMode = (req.headers['x-venar-mode'] || mode || 'auto').toLowerCase();
  const effectivePinnedProvider = (req.headers['x-venar-provider'] || pinnedProvider || '').toLowerCase().trim();

  // Route selection: Check if a specific catalog model was requested
  let candidates = [];
  let isCatalogModel = false;
  
  const allModels = [...MODEL_CATALOG, ...dynamicLiveModels];

  if (requestedModel && requestedModel !== 'auto' && requestedModel !== 'default') {
    const matched = allModels.find(m => 
      m.id.toLowerCase() === requestedModel.toLowerCase() || 
      m.name.toLowerCase() === requestedModel.toLowerCase()
    );
    if (matched && matched.routes && matched.routes.length > 0) {
      candidates = matched.routes.map(r => ({ p: r.p, m: r.m, label: r.label }));
      isCatalogModel = true;
    }
  }

  // Dual Execution Protocol:
  // Mode A: 'dedicated' -> User demands ONLY the specified model across providers hosting it (no unexpected category jumping)
  // Mode B: 'auto' -> Multi-tiered cascade: starts with candidate routes (if model specified), then cascades to category fallbacks
  if (effectiveMode === 'dedicated' && isCatalogModel) {
    // In dedicated mode, do NOT append category fallbacks
    // If pinned provider is specified, filter candidates strictly to that provider
    if (effectivePinnedProvider && effectivePinnedProvider !== 'auto') {
      candidates = candidates.filter(c => c.p.toLowerCase() === effectivePinnedProvider);
    }
  } else {
    // Auto-cascade mode across the ENTIRE 87+ Model Catalog & Dynamic Live Free Models
    const category = determineCategory(messages);
    
    // Tier 1: Category Specialists from allModels (87+ verified models)
    const categoryMatched = allModels.filter(m => 
      m.tags && (
        m.tags.includes(category) || 
        (category === 'coding' && (m.tags.includes('coding') || m.tags.includes('code'))) ||
        (category === 'reasoning' && (m.tags.includes('reasoning') || m.tags.includes('cot')))
      )
    );

    categoryMatched.forEach(m => {
      if (m.routes) {
        m.routes.forEach(r => {
          if (!candidates.some(c => c.p === r.p && c.m === r.m)) {
            candidates.push({ p: r.p, m: r.m, label: r.label, isFallback: true, modelId: m.id });
          }
        });
      }
    });

    // Tier 2: System Fast Fallbacks
    const categoryFallbacks = SYSTEM_MODELS[category] || SYSTEM_MODELS.general;
    categoryFallbacks.forEach(f => {
      if (!candidates.some(c => c.p === f.p && c.m === f.m)) {
        candidates.push({ p: f.p, m: f.m, isFallback: true });
      }
    });

    // Tier 3: Universal Redundancy across ALL remaining models in catalog (87+ models)
    allModels.forEach(m => {
      if (m.routes) {
        m.routes.forEach(r => {
          if (!candidates.some(c => c.p === r.p && c.m === r.m)) {
            candidates.push({ p: r.p, m: r.m, label: r.label, isFallback: true, modelId: m.id });
          }
        });
      }
    });

    // If pinned provider is specified, prioritize it at the top
    if (effectivePinnedProvider && effectivePinnedProvider !== 'auto') {
      candidates.sort((a, b) => {
        if (a.p.toLowerCase() === effectivePinnedProvider && b.p.toLowerCase() !== effectivePinnedProvider) return -1;
        if (b.p.toLowerCase() === effectivePinnedProvider && a.p.toLowerCase() !== effectivePinnedProvider) return 1;
        return 0;
      });
    }
  }

  // Apply custom preferred order if defined by user
  if (preferredOrder && preferredOrder.length > 0) {
    candidates.sort((a, b) => {
      // Prioritize explicit catalog routes first before fallbacks
      if (a.isFallback && !b.isFallback) return 1;
      if (!a.isFallback && b.isFallback) return -1;

      const idxA = preferredOrder.indexOf(a.p);
      const idxB = preferredOrder.indexOf(b.p);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }

  const failureReasons = [];
  const attemptedRoutes = [];

  for (const c of candidates) {
    const provider = c.p;
    const modelName = c.m;
    const pKey = (userKeys[provider] || '').trim();
    
    // Skip if user didn't provide this key or if it is currently cooling down
    if (!pKey) continue;
    if (isCoolingDown(pKey)) {
      failureReasons.push(`${provider}: In cooldown for ${Math.ceil((cooldowns[pKey] - Date.now()) / 1000)}s`);
      continue;
    }
    
    const config = PROVIDER_ENDPOINTS[provider];
    if (!config) continue;

    attemptedRoutes.push({ provider, model: modelName, isFallback: !!c.isFallback });
    console.log(`[Engine] Routing -> Provider: ${provider} | Model: ${modelName} | Stream: ${stream}`);
    if (metrics.providerStats[provider]) metrics.providerStats[provider].requests++;

    try {
      const providerReqStart = Date.now();

      // ==========================================
      // STREAMING FLOW (stream: true / SSE)
      // ==========================================
      if (stream) {
        // 1. OpenAI-compatible Streaming Passthrough
        if (config.type === 'openai') {
          let payloadBody = {
            model: modelName,
            messages,
            stream: true,
            max_tokens: effectiveMaxTokens,
            temperature: effectiveTemperature
          };

          let apiRes = await fetch(config.url, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${pKey}`, 
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://venar.ai',
              'X-Title': 'Venar Gateway'
            },
            body: JSON.stringify(payloadBody)
          });

          // OpenRouter Adaptive Token Budget Recovery:
          // If OpenRouter returns 402 because credit balance is low, auto-retry with affordable token budget!
          if (apiRes.status === 402 && provider === 'openrouter') {
            let errDetail = '';
            try {
              const errBody = await apiRes.clone().json();
              errDetail = errBody?.error?.message || errBody?.message || '';
            } catch(e) {}

            const affordMatch = errDetail.match(/can only afford (\d+)/i);
            if (affordMatch && parseInt(affordMatch[1]) >= 50) {
              const affordableTokens = Math.max(50, Math.floor(parseInt(affordMatch[1]) * 0.95));
              console.log(`[Engine] OpenRouter credit constraint for ${modelName}. Auto-retrying with affordable budget (${affordableTokens} tokens)...`);
              payloadBody.max_tokens = affordableTokens;
              apiRes = await fetch(config.url, {
                method: 'POST',
                headers: { 
                  'Authorization': `Bearer ${pKey}`, 
                  'Content-Type': 'application/json',
                  'HTTP-Referer': 'https://venar.ai',
                  'X-Title': 'Venar Gateway'
                },
                body: JSON.stringify(payloadBody)
              });
            }
          }

          if (apiRes.status === 429 || apiRes.status >= 500) {
            startCooldown(pKey, 60);
            failureReasons.push(`${config.name || provider} (${modelName}): Rate limited (HTTP ${apiRes.status})`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }
          if (!apiRes.ok) {
            let detail = `HTTP ${apiRes.status}`;
            try {
              const errBody = await apiRes.json();
              detail += `: ${errBody.error?.message || errBody.message || JSON.stringify(errBody).slice(0, 100)}`;
            } catch(e) {}
            console.warn(`[Engine] ${provider} stream returned status ${detail}`);
            failureReasons.push(`${config.name || provider} (${modelName}): ${detail}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('X-Venar-Provider', provider);
          res.setHeader('X-Venar-Model', modelName);
          if (c.isFallback) res.setHeader('X-Venar-Fallback', 'true');

          const reader = apiRes.body.getReader();
          let tokenCount = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
            tokenCount += 4;
          }

          // Record metrics
          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));

          // Emit end-of-stream cascade telemetry chunk
          res.write(`data: ${JSON.stringify({
            venar_telemetry: {
              provider,
              model: modelName,
              is_fallback: !!c.isFallback,
              latency_ms: latency
            }
          })}\n\n`);
          res.end();
          return;
        }

        // 2. Gemini SSE Stream Conversion
        else if (config.type === 'gemini') {
          const geminiModelsToTry = [modelName];
          if (modelName === 'gemini-2.0-flash' || modelName.includes('2.0-flash')) {
            geminiModelsToTry.push('gemini-2.5-flash', 'gemini-1.5-flash');
          } else if (modelName === 'gemini-1.5-pro') {
            geminiModelsToTry.push('gemini-1.5-flash');
          }

          let apiRes = null;
          let successfulGeminiModel = modelName;
          let lastGeminiErr = null;

          for (const gModel of geminiModelsToTry) {
            const url = `${config.url}${gModel}:streamGenerateContent?alt=sse&key=${pKey}`;
            const candidateRes = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: messages.map(m => ({
                  role: m.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: m.content }]
                })),
                generationConfig: {
                  maxOutputTokens: effectiveMaxTokens,
                  temperature: effectiveTemperature
                }
              })
            });

            if (candidateRes.status === 404 && geminiModelsToTry.length > 1) {
              console.warn(`[Engine] Gemini model ${gModel} not available (404). Cascading to newer version...`);
              lastGeminiErr = `HTTP 404 on ${gModel}`;
              continue;
            }
            apiRes = candidateRes;
            successfulGeminiModel = gModel;
            break;
          }

          if (!apiRes) {
            failureReasons.push(`${config.name || provider} (${modelName}): ${lastGeminiErr || 'All Gemini versions failed'}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          if (apiRes.status === 429 || apiRes.status >= 500) {
            startCooldown(pKey, 60);
            failureReasons.push(`${config.name || provider} (${successfulGeminiModel}): Rate limited (HTTP ${apiRes.status})`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }
          if (!apiRes.ok) {
            let detail = `HTTP ${apiRes.status}`;
            try {
              const errBody = await apiRes.json();
              detail += `: ${errBody.error?.message || errBody.message || JSON.stringify(errBody).slice(0, 100)}`;
            } catch(e) {}
            console.warn(`[Engine] Gemini stream returned status ${detail}`);
            failureReasons.push(`${config.name || provider} (${successfulGeminiModel}): ${detail}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('X-Venar-Provider', provider);
          res.setHeader('X-Venar-Model', successfulGeminiModel);
          if (c.isFallback) res.setHeader('X-Venar-Fallback', 'true');

          const reader = apiRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          const streamId = Math.random().toString(36).substring(7);
          let tokenCount = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              try {
                const data = JSON.parse(trimmed.slice(5).trim());
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  tokenCount += Math.ceil(text.length / 4);
                  const chunk = {
                    id: `chatcmpl-${streamId}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: `gemini/${successfulGeminiModel}`,
                    choices: [{ index: 0, delta: { content: text }, finish_reason: null }]
                  };
                  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
              } catch (e) {}
            }
          }

          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));

          // Emit end-of-stream cascade telemetry chunk
          res.write(`data: ${JSON.stringify({
            venar_telemetry: {
              provider,
              model: successfulGeminiModel,
              is_fallback: !!c.isFallback,
              latency_ms: latency
            }
          })}\n\n`);
          res.write(`data: [DONE]\n\n`);
          res.end();
          return;
        }

        // 3. Anthropic Messages Stream Conversion
        else if (config.type === 'anthropic') {
          const systemMsg = messages.find(m => m.role === 'system');
          const nonSystemMsgs = messages.filter(m => m.role !== 'system');

          const apiRes = await fetch(config.url, {
            method: 'POST',
            headers: {
              'x-api-key': pKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: modelName,
              max_tokens: effectiveMaxTokens,
              stream: true,
              ...(systemMsg ? { system: systemMsg.content } : {}),
              messages: nonSystemMsgs.map(m => ({ role: m.role, content: m.content }))
            })
          });

          if (apiRes.status === 429 || apiRes.status >= 500) {
            startCooldown(pKey, 60);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }
          if (!apiRes.ok) {
            console.warn(`[Engine] Anthropic stream returned status ${apiRes.status}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('X-Venar-Provider', provider);
          res.setHeader('X-Venar-Model', modelName);
          if (c.isFallback) res.setHeader('X-Venar-Fallback', 'true');

          const reader = apiRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          const streamId = Math.random().toString(36).substring(7);
          let tokenCount = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              try {
                const data = JSON.parse(trimmed.slice(5).trim());
                if (data.type === 'content_block_delta' && data.delta?.text) {
                  tokenCount += Math.ceil(data.delta.text.length / 4);
                  const chunk = {
                    id: `chatcmpl-${streamId}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: `anthropic/${modelName}`,
                    choices: [{ index: 0, delta: { content: data.delta.text }, finish_reason: null }]
                  };
                  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
              } catch (e) {}
            }
          }

          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));

          // Emit end-of-stream cascade telemetry chunk
          res.write(`data: ${JSON.stringify({
            venar_telemetry: {
              provider,
              model: modelName,
              is_fallback: !!c.isFallback,
              latency_ms: latency
            }
          })}\n\n`);
          res.write(`data: [DONE]\n\n`);
          res.end();
          return;
        }

        // 4. Cohere Stream Conversion
        else if (config.type === 'cohere') {
          const lastMsg = messages[messages.length - 1]?.content || "";
          const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
            message: m.content
          }));

          const apiRes = await fetch(config.url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${pKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: modelName,
              message: lastMsg,
              chat_history: history,
              stream: true,
              max_tokens: effectiveMaxTokens
            })
          });

          if (apiRes.status === 429 || apiRes.status >= 500) {
            startCooldown(pKey, 60);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }
          if (!apiRes.ok) {
            console.warn(`[Engine] Cohere stream returned status ${apiRes.status}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('X-Venar-Provider', provider);
          res.setHeader('X-Venar-Model', modelName);
          if (c.isFallback) res.setHeader('X-Venar-Fallback', 'true');

          const reader = apiRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          const streamId = Math.random().toString(36).substring(7);
          let tokenCount = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const data = JSON.parse(trimmed);
                if (data.event_type === 'text-generation' && data.text) {
                  tokenCount += Math.ceil(data.text.length / 4);
                  const chunk = {
                    id: `chatcmpl-${streamId}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: `cohere/${modelName}`,
                    choices: [{ index: 0, delta: { content: data.text }, finish_reason: null }]
                  };
                  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
              } catch (e) {}
            }
          }

          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));

          // Emit end-of-stream cascade telemetry chunk
          res.write(`data: ${JSON.stringify({
            venar_telemetry: {
              provider,
              model: modelName,
              is_fallback: !!c.isFallback,
              latency_ms: latency
            }
          })}\n\n`);
          res.write(`data: [DONE]\n\n`);
          res.end();
          return;
        }
      }

      // ==========================================
      // STANDARD NON-STREAMING FLOW (JSON)
      // ==========================================
      let responseText = null;

      // 1. OpenAI-compatible standard spec
      if (config.type === 'openai') {
        let payloadBody = {
          model: modelName,
          messages,
          max_tokens: effectiveMaxTokens,
          temperature: effectiveTemperature
        };

        let apiRes = await fetch(config.url, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${pKey}`, 
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://venar.ai',
            'X-Title': 'Venar Gateway'
          },
          body: JSON.stringify(payloadBody)
        });

        // OpenRouter Adaptive Token Budget Recovery
        if (apiRes.status === 402 && provider === 'openrouter') {
          let errDetail = '';
          try {
            const errBody = await apiRes.clone().json();
            errDetail = errBody?.error?.message || errBody?.message || '';
          } catch(e) {}

          const affordMatch = errDetail.match(/can only afford (\d+)/i);
          if (affordMatch && parseInt(affordMatch[1]) >= 50) {
            const affordableTokens = Math.max(50, Math.floor(parseInt(affordMatch[1]) * 0.95));
            console.log(`[Engine] OpenRouter credit constraint for ${modelName}. Auto-retrying with affordable budget (${affordableTokens} tokens)...`);
            payloadBody.max_tokens = affordableTokens;
            apiRes = await fetch(config.url, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${pKey}`, 
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://venar.ai',
                'X-Title': 'Venar Gateway'
              },
              body: JSON.stringify(payloadBody)
            });
          }
        }

        if (apiRes.status === 429 || apiRes.status >= 500) { 
          startCooldown(pKey, 60); 
          failureReasons.push(`${config.name || provider} (${modelName}): Rate limited (HTTP ${apiRes.status})`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }
        if (!apiRes.ok) {
          let detail = `HTTP ${apiRes.status}`;
          try {
            const errBody = await apiRes.json();
            detail += `: ${errBody.error?.message || errBody.message || JSON.stringify(errBody).slice(0, 100)}`;
          } catch(e) {}
          console.warn(`[Engine] ${provider} responded with status ${detail}`);
          failureReasons.push(`${config.name || provider} (${modelName}): ${detail}`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }

        const data = await apiRes.json();
        responseText = data.choices?.[0]?.message?.content;
      } 
      // 2. Google Gemini native spec
      else if (config.type === 'gemini') {
        const geminiModelsToTry = [modelName];
        if (modelName === 'gemini-2.0-flash' || modelName.includes('2.0-flash')) {
          geminiModelsToTry.push('gemini-2.5-flash', 'gemini-1.5-flash');
        } else if (modelName === 'gemini-1.5-pro') {
          geminiModelsToTry.push('gemini-1.5-flash');
        }

        let apiRes = null;
        let successfulGeminiModel = modelName;

        for (const gModel of geminiModelsToTry) {
          const url = `${config.url}${gModel}:generateContent?key=${pKey}`;
          const candidateRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              })),
              generationConfig: {
                maxOutputTokens: effectiveMaxTokens,
                temperature: effectiveTemperature
              }
            })
          });

          if (candidateRes.status === 404 && geminiModelsToTry.length > 1) {
            console.warn(`[Engine] Gemini model ${gModel} not available (404). Cascading to newer version...`);
            continue;
          }
          apiRes = candidateRes;
          successfulGeminiModel = gModel;
          break;
        }

        if (!apiRes) {
          failureReasons.push(`${config.name || provider} (${modelName}): All Gemini model versions failed`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue;
        }

        if (apiRes.status === 429 || apiRes.status >= 500) { 
          startCooldown(pKey, 60); 
          failureReasons.push(`${config.name || provider} (${successfulGeminiModel}): Rate limited (HTTP ${apiRes.status})`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }
        if (!apiRes.ok) {
          let detail = `HTTP ${apiRes.status}`;
          try {
            const errBody = await apiRes.json();
            detail += `: ${errBody.error?.message || errBody.message || JSON.stringify(errBody).slice(0, 100)}`;
          } catch(e) {}
          console.warn(`[Engine] Gemini responded with status ${detail}`);
          failureReasons.push(`${config.name || provider} (${successfulGeminiModel}): ${detail}`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }

        const data = await apiRes.json();
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      }
      // 3. Anthropic Messages native spec
      else if (config.type === 'anthropic') {
        const systemMsg = messages.find(m => m.role === 'system');
        const nonSystemMsgs = messages.filter(m => m.role !== 'system');

        const apiRes = await fetch(config.url, {
          method: 'POST',
          headers: {
            'x-api-key': pKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: modelName,
            max_tokens: effectiveMaxTokens,
            ...(systemMsg ? { system: systemMsg.content } : {}),
            messages: nonSystemMsgs.map(m => ({ role: m.role, content: m.content }))
          })
        });

        if (apiRes.status === 429 || apiRes.status >= 500) {
          startCooldown(pKey, 60); 
          failureReasons.push(`${config.name || provider} (${modelName}): Rate limited (HTTP ${apiRes.status})`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }
        if (!apiRes.ok) {
          let detail = `HTTP ${apiRes.status}`;
          try {
            const errBody = await apiRes.json();
            detail += `: ${errBody.error?.message || errBody.message || JSON.stringify(errBody).slice(0, 100)}`;
          } catch(e) {}
          console.warn(`[Engine] Anthropic responded with status ${detail}`);
          failureReasons.push(`${config.name || provider} (${modelName}): ${detail}`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }

        const data = await apiRes.json();
        responseText = data.content?.[0]?.text;
      }
      // 4. Cohere Chat native spec
      else if (config.type === 'cohere') {
        const lastMsg = messages[messages.length - 1]?.content || "";
        const history = messages.slice(0, -1).map(m => ({
          role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
          message: m.content
        }));

        const apiRes = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${pKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: modelName,
            message: lastMsg,
            chat_history: history,
            max_tokens: effectiveMaxTokens
          })
        });

        if (apiRes.status === 429 || apiRes.status >= 500) {
          startCooldown(pKey, 60);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue;
        }
        if (!apiRes.ok) {
          console.warn(`[Engine] Cohere responded with status ${apiRes.status}`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue;
        }

        const data = await apiRes.json();
        responseText = data.text;
      }
      
      // If we got a valid response, return standard format immediately
      if (responseText) {
        metrics.successfulRequests++;
        const latency = Date.now() - providerReqStart;
        if (metrics.providerStats[provider]) {
          metrics.providerStats[provider].successes++;
          metrics.providerStats[provider].lastLatencyMs = latency;
        }
        const tokenEst = Math.ceil(responseText.length / 4);
        metrics.totalTokensEstimated += tokenEst;
        metrics.totalCostSavedUSD += parseFloat(((tokenEst / 1000) * 0.003).toFixed(5));

        res.setHeader('X-Venar-Provider', provider);
        res.setHeader('X-Venar-Model', modelName);
        res.setHeader('X-Venar-Fallback-Chain', encodeURIComponent(JSON.stringify(attemptedRoutes)));
        if (c.isFallback) res.setHeader('X-Venar-Fallback', 'true');

        return res.json({
          id: `chatcmpl-${Math.random().toString(36).substring(7)}`,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: `${provider}/${modelName}`,
          venar_telemetry: {
            provider,
            model: modelName,
            is_fallback: !!c.isFallback,
            attempts: attemptedRoutes,
            latency_ms: latency
          },
          choices: [{ index: 0, message: { role: "assistant", content: responseText }, finish_reason: "stop" }]
        });
      }
    } catch (e) {
      console.error(`[Engine] Network error for ${provider}. Triggering fallback...`, e.message);
      startCooldown(pKey, 30);
      if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
      continue;
    }
  }

  // Fallback exhausted
  metrics.failedRequests++;
  return res.status(503).json({
    error: "All eligible models in your active key pool hit rate limits or failed. Engine exhausted.",
    reasons: failureReasons.length > 0 ? failureReasons : ["No active keys matched this prompt category or all keys were empty."]
  });
});

// Optional Master Passcode verification
app.post('/api/verify-passcode', (req, res) => {
  const { passcode } = req.body;
  const master = process.env.VENAR_MASTER_PASSCODE;
  if (!master) {
    return res.json({ success: true, message: "Open access mode" });
  }
  if (passcode === master) {
    return res.json({ success: true, authorized: true });
  }
  return res.status(401).json({ success: false, error: "Incorrect Master Passcode" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`🧠 INFINITE TOKEN ENGINE ACTIVE ON PORT ${PORT}`));
}

module.exports = app;
