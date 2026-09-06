const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { encryptPayload, decryptPayload } = require('./crypto-utils');

const app = express();
app.use(cors());
app.use(express.json());

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
  anthropic: { url: 'https://api.anthropic.com/v1/messages', type: 'anthropic', name: 'Anthropic Claude' }
};

// Initialize metrics map for providers
Object.keys(PROVIDER_ENDPOINTS).forEach(k => {
  metrics.providerStats[k] = { requests: 0, successes: 0, failures: 0, lastLatencyMs: 0 };
});

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

// Registration Endpoint (with AES-256-GCM Encryption & Custom Ordering)
app.post('/api/register-keys', (req, res) => {
  const { keys, preferredOrder, ...directPayload } = req.body;
  const rawKeys = keys || directPayload;

  if (!rawKeys || Object.keys(rawKeys).length === 0) {
    return res.status(400).json({ error: "No keys provided!" });
  }

  const virtualKey = 'sk-merged-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Encrypt user keys on disk with AES-256-GCM
  const encrypted = encryptPayload(rawKeys);
  keysDatabase[virtualKey] = {
    ...encrypted,
    preferredOrder: Array.isArray(preferredOrder) ? preferredOrder : [],
    created: Date.now()
  };
  persistKeys();

  res.json({
    success: true,
    virtualKey: virtualKey,
    endpoint: `${req.protocol}://${req.get('host')}/v1/chat/completions`
  });
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
    registeredKeysCount: Object.keys(keysDatabase).length
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
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing/Invalid Authorization" });
  }

  const virtualKey = authHeader.split(' ')[1];
  const storedRecord = keysDatabase[virtualKey];
  if (!storedRecord) {
    return res.status(401).json({ error: "Invalid Ultimate Merged API Key!" });
  }

  // Decrypt user keys securely in RAM
  const userKeys = decryptPayload(storedRecord);
  if (!userKeys) {
    return res.status(500).json({ error: "Failed to decrypt provider keys" });
  }

  const { messages, stream = false } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request. Messages array required." });
  }

  const category = determineCategory(messages);
  let candidates = [...SYSTEM_MODELS[category]];

  // Apply custom preferred order if defined by user
  if (storedRecord.preferredOrder && storedRecord.preferredOrder.length > 0) {
    candidates.sort((a, b) => {
      const idxA = storedRecord.preferredOrder.indexOf(a.p);
      const idxB = storedRecord.preferredOrder.indexOf(b.p);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }

  for (const c of candidates) {
    const provider = c.p;
    const modelName = c.m;
    const pKey = userKeys[provider];
    
    // Skip if user didn't provide this key or if it is currently cooling down
    if (!pKey || isCoolingDown(pKey)) continue;
    
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
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }
          if (!apiRes.ok) {
            console.warn(`[Engine] ${provider} stream returned status ${apiRes.status}`);
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
            if (metrics.providerStats[provider]) metrics.providerStats[provider].failures++;
            continue;
          }
          if (!apiRes.ok) {
            console.warn(`[Engine] Gemini stream returned status ${apiRes.status}`);
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
  return res.status(503).json({ error: "All eligible models in your active key pool hit rate limits or failed. Engine exhausted." });
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
