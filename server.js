const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { encryptPayload, decryptPayload, encodeStatelessKey, decodeStatelessKey } = require('./crypto-utils');

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

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

// Flagship Experiential-Grade Universal Model Catalog
const MODEL_CATALOG = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    family: 'Anthropic',
    badge: '👑 Flagship Coder',
    context: '200K',
    speed: '~85 t/s',
    tags: ['coding', 'reasoning', 'free', 'popular', 'flagship'],
    desc: 'Top-tier coding, system architecture, and nuanced reasoning.',
    routes: [
      { p: 'github', m: 'Claude-3.5-Sonnet', free: true, label: 'GitHub Models (Free PAT)' },
      { p: 'openrouter', m: 'anthropic/claude-3.5-sonnet', free: false, label: 'OpenRouter' },
      { p: 'anthropic', m: 'claude-3-5-sonnet-20241022', free: false, label: 'Anthropic Direct' }
    ]
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 Reasoning',
    family: 'DeepSeek',
    badge: '🧠 Deep Reasoning',
    context: '128K',
    speed: '~280 t/s',
    tags: ['reasoning', 'coding', 'free', 'popular', 'flagship'],
    desc: 'State-of-the-art open reasoning rivaling OpenAI o1, with full chain-of-thought.',
    routes: [
      { p: 'openrouter', m: 'deepseek/deepseek-r1:free', free: true, label: 'OpenRouter Free' },
      { p: 'groq', m: 'deepseek-r1-distill-llama-70b', free: true, label: 'Groq Cloud (Free)' },
      { p: 'together', m: 'deepseek-ai/DeepSeek-R1', free: false, label: 'Together AI' },
      { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-R1', free: false, label: 'SiliconFlow' }
    ]
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 (671B)',
    family: 'DeepSeek',
    badge: '⚡ MoE Powerhouse',
    context: '64K',
    speed: '~95 t/s',
    tags: ['general', 'coding', 'free', 'popular'],
    desc: 'Ultra-capable 671B parameter Mixture-of-Experts general intelligence model.',
    routes: [
      { p: 'openrouter', m: 'deepseek/deepseek-chat:free', free: true, label: 'OpenRouter Free' },
      { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-V3', free: false, label: 'SiliconFlow' },
      { p: 'together', m: 'deepseek-ai/DeepSeek-V3', free: false, label: 'Together AI' },
      { p: 'novita', m: 'deepseek/deepseek-v3', free: false, label: 'Novita AI' }
    ]
  },
  {
    id: 'qwen-2-5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    family: 'Qwen',
    badge: '💻 Specialist Coder',
    context: '128K',
    speed: '~110 t/s',
    tags: ['coding', 'free', 'popular'],
    desc: 'Ranked #1 open-source coding model in human eval and competitive benchmarks.',
    routes: [
      { p: 'openrouter', m: 'qwen/qwen-2.5-coder-32b-instruct:free', free: true, label: 'OpenRouter Free' },
      { p: 'together', m: 'Qwen/Qwen2.5-Coder-32B-Instruct', free: false, label: 'Together AI' },
      { p: 'siliconflow', m: 'Qwen/Qwen2.5-Coder-32B-Instruct', free: false, label: 'SiliconFlow' },
      { p: 'deepinfra', m: 'Qwen/Qwen2.5-Coder-32B-Instruct', free: false, label: 'DeepInfra' }
    ]
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Google Gemini 2.0 Flash',
    family: 'Google',
    badge: '🚀 Next-Gen Flash',
    context: '1M',
    speed: '~140 t/s',
    tags: ['general', 'fast', 'free', 'popular', 'flagship'],
    desc: 'Real-time multi-modal with 1M context window and free 1,500 daily requests.',
    routes: [
      { p: 'gemini', m: 'gemini-2.0-flash', free: true, label: 'Google AI Studio (Free 1500 RPD)' },
      { p: 'openrouter', m: 'google/gemini-2.0-flash-exp:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Google Gemini 1.5 Pro',
    family: 'Google',
    badge: '📚 2M Context King',
    context: '2M',
    speed: '~75 t/s',
    tags: ['reasoning', 'coding', 'free', 'popular'],
    desc: 'Massive 2-million token context window for full codebase and book analysis.',
    routes: [
      { p: 'gemini', m: 'gemini-1.5-pro', free: true, label: 'Google AI Studio (Free)' },
      { p: 'openrouter', m: 'google/gemini-pro-1.5:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'llama-3-3-70b',
    name: 'Meta Llama 3.3 70B',
    family: 'Meta',
    badge: '🔥 Open Frontier',
    context: '128K',
    speed: '~350 t/s',
    tags: ['general', 'reasoning', 'coding', 'fast', 'free', 'popular'],
    desc: 'Matches original Llama 3.1 405B capabilities at 1/5 the latency.',
    routes: [
      { p: 'groq', m: 'llama-3.3-70b-versatile', free: true, label: 'Groq Cloud (Free)' },
      { p: 'cerebras', m: 'llama-3.3-70b', free: true, label: 'Cerebras (Free 1800 t/s)' },
      { p: 'github', m: 'Meta-Llama-3.3-70B-Instruct', free: true, label: 'GitHub Models (Free)' },
      { p: 'openrouter', m: 'meta-llama/llama-3.3-70b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    family: 'OpenAI',
    badge: '🌟 Omnimodal Peak',
    context: '128K',
    speed: '~90 t/s',
    tags: ['general', 'reasoning', 'coding', 'free', 'popular', 'flagship'],
    desc: 'OpenAIs flagship omni model for complex reasoning and enterprise tasks.',
    routes: [
      { p: 'github', m: 'gpt-4o', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openai', m: 'gpt-4o', free: false, label: 'OpenAI Direct' },
      { p: 'openrouter', m: 'openai/gpt-4o', free: false, label: 'OpenRouter' }
    ]
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o-mini',
    family: 'OpenAI',
    badge: '⚡ Lightweight Pro',
    context: '128K',
    speed: '~130 t/s',
    tags: ['fast', 'general', 'free', 'popular'],
    desc: 'High-speed, cost-effective multimodal mini model with exceptional intelligence.',
    routes: [
      { p: 'github', m: 'gpt-4o-mini', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openai', m: 'gpt-4o-mini', free: false, label: 'OpenAI Direct' },
      { p: 'openrouter', m: 'openai/gpt-4o-mini', free: false, label: 'OpenRouter' }
    ]
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    family: 'Anthropic',
    badge: '⚡ Supersonic Claude',
    context: '200K',
    speed: '~120 t/s',
    tags: ['fast', 'coding', 'free'],
    desc: 'Blazing fast responses with Claude 3 Opus-level coding performance.',
    routes: [
      { p: 'openrouter', m: 'anthropic/claude-3.5-haiku', free: false, label: 'OpenRouter' },
      { p: 'anthropic', m: 'claude-3-5-haiku-20241022', free: false, label: 'Anthropic Direct' }
    ]
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    family: 'Mistral',
    badge: '🇪🇺 European Flagship',
    context: '128K',
    speed: '~80 t/s',
    tags: ['reasoning', 'coding', 'free'],
    desc: 'Mistrals flagship 123B model with top tier multilingual and code generation.',
    routes: [
      { p: 'github', m: 'Mistral-large-2407', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'mistral', m: 'mistral-large-latest', free: false, label: 'Mistral AI Direct' },
      { p: 'openrouter', m: 'mistralai/mistral-large', free: false, label: 'OpenRouter' }
    ]
  },
  {
    id: 'llama-3-1-8b',
    name: 'Meta Llama 3.1 8B Instant',
    family: 'Meta',
    badge: '⚡ 1800+ Tokens/Sec',
    context: '128K',
    speed: '~1800 t/s',
    tags: ['fast', 'general', 'free'],
    desc: 'Instant generation at hardware wire speed on Cerebras & Groq free tiers.',
    routes: [
      { p: 'cerebras', m: 'llama3.1-8b', free: true, label: 'Cerebras (Free 1800 t/s)' },
      { p: 'groq', m: 'llama-3.1-8b-instant', free: true, label: 'Groq Cloud (Free)' },
      { p: 'github', m: 'Meta-Llama-3.1-8B-Instruct', free: true, label: 'GitHub Models (Free)' },
      { p: 'openrouter', m: 'meta-llama/llama-3.1-8b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'command-r-plus',
    name: 'Cohere Command R+',
    family: 'Cohere',
    badge: '🔍 RAG & Search Master',
    context: '128K',
    speed: '~70 t/s',
    tags: ['reasoning', 'general', 'free'],
    desc: 'Optimized for high-accuracy Retrieval-Augmented Generation (RAG) and tool use.',
    routes: [
      { p: 'github', m: 'Cohere-command-r-plus', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'cohere', m: 'command-r-plus', free: true, label: 'Cohere Developer Free' },
      { p: 'openrouter', m: 'cohere/command-r-plus', free: false, label: 'OpenRouter' }
    ]
  }
];

// Real, Active Model IDs for Fallback Routing
const SYSTEM_MODELS = {
  general: [
    { p: 'openrouter', m: 'google/gemini-2.0-flash-exp:free' },
    { p: 'groq', m: 'llama-3.3-70b-versatile' },
    { p: 'cerebras', m: 'llama-3.3-70b' },
    { p: 'gemini', m: 'gemini-2.0-flash' },
    { p: 'openai', m: 'gpt-4o-mini' },
    { p: 'openrouter', m: 'meta-llama/llama-3-8b-instruct:free' },
    { p: 'groq', m: 'llama-3.1-8b-instant' },
    { p: 'together', m: 'meta-llama/Llama-3-8b-chat-hf' },
    { p: 'siliconflow', m: 'Qwen/Qwen2.5-7B-Instruct' },
    { p: 'huggingface', m: 'meta-llama/Meta-Llama-3-8B-Instruct' },
    { p: 'mistral', m: 'open-mistral-7b' },
    { p: 'deepinfra', m: 'meta-llama/Meta-Llama-3-8B-Instruct' },
    { p: 'fireworks', m: 'accounts/fireworks/models/llama-v3p1-8b-instruct' },
    { p: 'novita', m: 'meta-llama/llama-3-8b-instruct' },
    { p: 'nvidia', m: 'meta/llama3-8b-instruct' },
    { p: 'cohere', m: 'command-r' }
  ],
  coding: [
    { p: 'groq', m: 'llama-3.3-70b-versatile' },
    { p: 'cerebras', m: 'llama-3.3-70b' },
    { p: 'gemini', m: 'gemini-2.0-flash' },
    { p: 'openai', m: 'gpt-4o-mini' },
    { p: 'openrouter', m: 'qwen/qwen-2.5-coder-32b-instruct:free' },
    { p: 'together', m: 'Qwen/Qwen2.5-72B-Instruct' },
    { p: 'deepinfra', m: 'Qwen/Qwen2.5-72B-Instruct' },
    { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-Coder-V2-Instruct' },
    { p: 'huggingface', m: 'Qwen/Qwen2.5-Coder-32B-Instruct' }
  ],
  reasoning: [
    { p: 'gemini', m: 'gemini-2.0-flash' },
    { p: 'groq', m: 'llama-3.3-70b-versatile' },
    { p: 'cerebras', m: 'llama-3.3-70b' },
    { p: 'openai', m: 'gpt-4o-mini' },
    { p: 'openrouter', m: 'deepseek/deepseek-r1:free' },
    { p: 'together', m: 'meta-llama/Llama-3-70b-chat-hf' },
    { p: 'deepinfra', m: 'meta-llama/Meta-Llama-3-70B-Instruct' },
    { p: 'mistral', m: 'mistral-large-latest' },
    { p: 'anthropic', m: 'claude-3-5-haiku-20241022' }
  ]
};

app.use(express.static(path.join(__dirname, 'public')));

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
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${cleanKey}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
      });
      const latencyMs = Date.now() - startTime;
      if (r.ok) return res.json({ valid: true, provider, latencyMs, model: 'gemini-2.0-flash' });
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
      else if (provider === 'openrouter') testModel = 'google/gemini-2.0-flash-exp:free';
      else if (provider === 'openai') testModel = 'gpt-4o-mini';
      else if (provider === 'together') testModel = 'meta-llama/Llama-3-8b-chat-hf';
      else if (provider === 'siliconflow') testModel = 'Qwen/Qwen2.5-7B-Instruct';
      else if (provider === 'deepinfra') testModel = 'meta-llama/Meta-Llama-3-8B-Instruct';
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

  res.json({
    metrics,
    cooldowns: activeCooldowns,
    providersCount: Object.keys(PROVIDER_ENDPOINTS).length,
    registeredKeysCount: Object.keys(keysDatabase).length,
    catalogModelsCount: MODEL_CATALOG.length
  });
});

// Full Model Catalog Endpoint (Experiential Labs Style)
app.get('/api/models', (req, res) => {
  res.json({
    total: MODEL_CATALOG.length,
    models: MODEL_CATALOG
  });
});

// OpenAI-Compatible List Models Endpoint (for Cursor, Cline, LibreChat)
app.get('/v1/models', (req, res) => {
  res.json({
    object: "list",
    data: MODEL_CATALOG.map(m => ({
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

  // 4. Demo Fallback: check if server environment has shared sandbox keys
  if (!userKeys || Object.keys(userKeys).length === 0) {
    const demo = {};
    if (process.env.GROQ_API_KEY) demo.groq = process.env.GROQ_API_KEY;
    if (process.env.GEMINI_API_KEY) demo.gemini = process.env.GEMINI_API_KEY;
    if (process.env.GITHUB_TOKEN) demo.github = process.env.GITHUB_TOKEN;
    if (process.env.OPENROUTER_API_KEY) demo.openrouter = process.env.OPENROUTER_API_KEY;
    if (Object.keys(demo).length > 0) {
      userKeys = demo;
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

  const { messages, model: requestedModel, stream = false } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request. Messages array required." });
  }

  // Route selection: Check if a specific catalog model was requested
  let candidates = [];
  let isCatalogModel = false;
  
  if (requestedModel && requestedModel !== 'auto' && requestedModel !== 'default') {
    const matched = MODEL_CATALOG.find(m => 
      m.id.toLowerCase() === requestedModel.toLowerCase() || 
      m.name.toLowerCase() === requestedModel.toLowerCase()
    );
    if (matched && matched.routes && matched.routes.length > 0) {
      candidates = matched.routes.map(r => ({ p: r.p, m: r.m }));
      isCatalogModel = true;
    }
  }

  // Fallback to intelligent prompt categorization if no specific model matched
  if (candidates.length === 0) {
    const category = determineCategory(messages);
    candidates = [...(SYSTEM_MODELS[category] || SYSTEM_MODELS.general)];
  }

  // Apply custom preferred order if defined by user
  if (preferredOrder && preferredOrder.length > 0) {
    candidates.sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.p);
      const idxB = preferredOrder.indexOf(b.p);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }

  const failureReasons = [];

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
          const apiRes = await fetch(config.url, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${pKey}`, 
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://venar.ai',
              'X-Title': 'Venar Gateway'
            },
            body: JSON.stringify({ model: modelName, messages, stream: true })
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
            console.warn(`[Engine] ${provider} stream returned status ${detail}`);
            failureReasons.push(`${config.name || provider} (${modelName}): ${detail}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');

          const reader = apiRes.body.getReader();
          let tokenCount = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
            tokenCount += 4;
          }
          res.end();

          // Record metrics
          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));
          return;
        }

        // 2. Gemini SSE Stream Conversion
        else if (config.type === 'gemini') {
          const url = `${config.url}${modelName}:streamGenerateContent?alt=sse&key=${pKey}`;
          const apiRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              }))
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
            console.warn(`[Engine] Gemini stream returned status ${detail}`);
            failureReasons.push(`${config.name || provider} (${modelName}): ${detail}`);
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }

          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');

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
                    model: `gemini/${modelName}`,
                    choices: [{ index: 0, delta: { content: text }, finish_reason: null }]
                  };
                  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
              } catch (e) {}
            }
          }
          res.write(`data: [DONE]\n\n`);
          res.end();

          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));
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
              max_tokens: 1024,
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
          res.write(`data: [DONE]\n\n`);
          res.end();

          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));
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
              stream: true
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
          res.write(`data: [DONE]\n\n`);
          res.end();

          metrics.successfulRequests++;
          const latency = Date.now() - providerReqStart;
          if (metrics.providerStats[provider]) {
            metrics.providerStats[provider].successes++;
            metrics.providerStats[provider].lastLatencyMs = latency;
          }
          metrics.totalTokensEstimated += tokenCount;
          metrics.totalCostSavedUSD += parseFloat(((tokenCount / 1000) * 0.003).toFixed(5));
          return;
        }
      }

      // ==========================================
      // STANDARD NON-STREAMING FLOW (JSON)
      // ==========================================
      let responseText = null;

      // 1. OpenAI-compatible standard spec
      if (config.type === 'openai') {
        const apiRes = await fetch(config.url, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${pKey}`, 
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://venar.ai',
            'X-Title': 'Venar Gateway'
          },
          body: JSON.stringify({ model: modelName, messages })
        });

        if (apiRes.status === 429 || apiRes.status >= 500) { 
          startCooldown(pKey, 60); 
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }
        if (!apiRes.ok) {
          console.warn(`[Engine] ${provider} responded with status ${apiRes.status}`);
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }

        const data = await apiRes.json();
        responseText = data.choices?.[0]?.message?.content;
      } 
      // 2. Google Gemini native spec
      else if (config.type === 'gemini') {
        const url = `${config.url}${modelName}:generateContent?key=${pKey}`;
        const apiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }))
          })
        });

        if (apiRes.status === 429 || apiRes.status >= 500) { 
          startCooldown(pKey, 60); 
          if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
          continue; 
        }
        if (!apiRes.ok) {
          console.warn(`[Engine] Gemini responded with status ${apiRes.status}`);
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
            max_tokens: 1024,
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
          console.warn(`[Engine] Anthropic responded with status ${apiRes.status}`);
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
            chat_history: history
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

        return res.json({
          id: `chatcmpl-${Math.random().toString(36).substring(7)}`,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: `${provider}/${modelName}`,
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
