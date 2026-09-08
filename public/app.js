import { NeatGradient } from "https://esm.sh/@firecms/neat";
import { initParticleText } from "./particle-text.js";

const config = {
    colors: [
        { color: '#FF5772', enabled: true },
        { color: '#00B7FF', enabled: true },
        { color: '#FFC600', enabled: true },
        { color: '#8B6AE6', enabled: true },
        { color: '#2E0EC7', enabled: true },
        { color: '#FF9A9E', enabled: true },
    ],
    speed: 2.5,
    horizontalPressure: 2,
    verticalPressure: 4,
    waveFrequencyX: 4,
    waveFrequencyY: 4,
    waveAmplitude: 6,
    shadows: 1,
    highlights: 5,
    colorBrightness: 1,
    colorSaturation: 7,
    wireframe: false,
    colorBlending: 4,
    backgroundColor: '#FFC600',
    backgroundAlpha: 1,
    grainScale: 0,
    grainSparsity: 0,
    grainIntensity: 0,
    grainSpeed: 1,
    resolution: 0.65,
    yOffset: 173.33334350585938,
    yOffsetWaveMultiplier: 4,
    yOffsetColorMultiplier: 6.3,
    yOffsetFlowMultiplier: 4,
    flowDistortionA: 0,
    flowDistortionB: 0,
    flowScale: 1,
    flowEase: 0,
    flowEnabled: false,
    enableProceduralTexture: false,
    transparentTextureVoid: false,
    textureVoidLikelihood: 0.45,
    textureVoidWidthMin: 200,
    textureVoidWidthMax: 486,
    textureBandDensity: 2.15,
    textureColorBlending: 0.01,
    textureSeed: 333,
    textureEase: 0.5,
    proceduralBackgroundColor: '#000000',
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,
    vignetteIntensity: 0,
    vignetteRadius: 0.8,
    fresnelEnabled: true,
    fresnelPower: 2,
    fresnelIntensity: 0.6,
    fresnelColor: '#F90707',
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    bloomIntensity: 0,
    bloomThreshold: 0.95,
    chromaticAberration: 1,
    shapeType: 'sphere',
    shapeRotationX: 0,
    shapeRotationY: 0,
    shapeRotationZ: 0,
    shapeAutoRotateSpeedX: 0,
    shapeAutoRotateSpeedY: 0,
    sphereRadius: 15,
    torusRadius: 15,
    torusTube: 5,
    cylinderRadius: 10,
    cylinderHeight: 40,
    planeBend: 0,
    planeTwist: 0,
    silhouetteFade: 0.25,
    cylinderFade: 0.08,
    ribbonFade: 0.05,
    flatShading: false,
    cameraLock: false,
    cameraX: 0,
    cameraY: -12,
    cameraZ: 0,
    cameraRotationX: 0,
    cameraRotationY: 0,
    cameraRotationZ: 0,
    cameraZoom: 4.4,
};

const gradient = new NeatGradient({
    ref: document.getElementById("gradient"),
    ...config
});

// Initialize Particle Text Effect
initParticleText();

window.addEventListener("scroll", () => {
    gradient.yOffset = window.scrollY;
});

const providers = [
  { id: 'openrouter', name: 'OpenRouter', type: 'bulk', desc: 'Single key unlocks 30+ free models (Llama 3, Qwen, Gemma)', link: 'https://openrouter.ai/settings/keys', color: 'rgba(139, 92, 246, 0.4)' },
  { id: 'gemini', name: 'Google AI Studio', type: 'direct', desc: 'Gemini 1.5/2.5 Flash & Pro. 1.5M context window, 1500 RPD free.', link: 'https://aistudio.google.com/app/apikey', color: 'rgba(59, 130, 246, 0.4)' },
  { id: 'groq', name: 'Groq Cloud', type: 'direct', desc: 'Fastest inference. Llama 3.3 70B & Gemma 2 free tier.', link: 'https://console.groq.com/keys', color: 'rgba(249, 115, 22, 0.4)' },
  { id: 'huggingface', name: 'Hugging Face', type: 'bulk', desc: 'Serverless Inference API for hundreds of open-source weights.', link: 'https://huggingface.co/settings/tokens', color: 'rgba(234, 179, 8, 0.4)' },
  { id: 'together', name: 'Together AI', type: 'bulk', desc: 'Extensive free sandbox for leading open-source models.', link: 'https://api.together.xyz/settings/api-keys', color: 'rgba(37, 99, 235, 0.4)' },
  { id: 'cohere', name: 'Cohere', type: 'direct', desc: 'Command-R and Command-R+ free developer rate limits.', link: 'https://dashboard.cohere.com/api-keys', color: 'rgba(16, 185, 129, 0.4)' },
  { id: 'cerebras', name: 'Cerebras', type: 'direct', desc: 'High-throughput Llama inference with massive free token limits.', link: 'https://cloud.cerebras.ai/', color: 'rgba(239, 68, 68, 0.4)' },
  { id: 'siliconflow', name: 'SiliconFlow', type: 'bulk', desc: 'OpenAI-compatible APIs for open-source models globally.', link: 'https://siliconflow.cn/zh-cn/', color: 'rgba(14, 165, 233, 0.4)' },
  { id: 'mistral', name: 'Mistral AI', type: 'direct', desc: 'La Plateforme experimental free tiers for specific Mistral models.', link: 'https://console.mistral.ai/api-keys/', color: 'rgba(251, 146, 60, 0.4)' },
  { id: 'nvidia', name: 'NVIDIA NIM', type: 'direct', desc: 'Free trial credits and inference APIs for optimized models.', link: 'https://build.nvidia.com/explore/discover', color: 'rgba(34, 197, 94, 0.4)' },
  { id: 'deepinfra', name: 'DeepInfra', type: 'bulk', desc: 'Serverless endpoints for multiple leading open models.', link: 'https://deepinfra.com/dash/api_keys', color: 'rgba(168, 85, 247, 0.4)' },
  { id: 'fireworks', name: 'Fireworks AI', type: 'bulk', desc: 'High-speed generative AI platform with free tiers.', link: 'https://fireworks.ai/api-keys', color: 'rgba(244, 63, 94, 0.4)' },
  { id: 'novita', name: 'Novita AI', type: 'bulk', desc: 'Extensive LLM and image generation APIs.', link: 'https://novita.ai/dashboard/key', color: 'rgba(99, 102, 241, 0.4)' },
  { id: 'ai21', name: 'AI21 Labs', type: 'direct', desc: 'Jurassic and Jamba models with free developer quotas.', link: 'https://studio.ai21.com/account/api-key', color: 'rgba(217, 70, 239, 0.4)' },
  { id: 'cloudflare', name: 'Cloudflare Workers AI', type: 'bulk', desc: 'Serverless AI inference with global free tier.', link: 'https://dash.cloudflare.com/', color: 'rgba(245, 158, 11, 0.4)' },
  { id: 'anthropic', name: 'Anthropic (Claude)', type: 'direct', desc: 'Free trial API credits upon registration (usually $5).', link: 'https://console.anthropic.com/settings/keys', color: 'rgba(212, 162, 118, 0.4)' },
  { id: 'openai', name: 'OpenAI', type: 'direct', desc: 'Standard platform with initial free trial credit (requires phone).', link: 'https://platform.openai.com/api-keys', color: 'rgba(16, 163, 127, 0.4)' },
  { id: 'perplexity', name: 'Perplexity API', type: 'direct', desc: 'Online LLM inference with trial access.', link: 'https://www.perplexity.ai/settings/api', color: 'rgba(20, 184, 166, 0.4)' },
  { id: 'github', name: 'GitHub Models (Azure)', type: 'direct', desc: 'Free Claude 3.5 Sonnet, GPT-4o, Llama 3.3 using GitHub Personal Access Token (ghp_...).', link: 'https://github.com/settings/tokens', color: 'rgba(36, 41, 47, 0.4)' }
];

// Initialize Provider Grid & Priority Tracking
const container = document.getElementById('providers-container');
const preferredOrder = [];

window.togglePriority = function(providerId) {
  const btn = document.getElementById(`prio-${providerId}`);
  const idx = preferredOrder.indexOf(providerId);
  if (idx > -1) {
    preferredOrder.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerText = "+ Priority";
  } else {
    preferredOrder.push(providerId);
    btn.classList.add('active');
    btn.innerText = `⭐ Priority #${preferredOrder.length}`;
  }
  // Update numbers on remaining active buttons
  preferredOrder.forEach((id, i) => {
    const b = document.getElementById(`prio-${id}`);
    if (b) b.innerText = `⭐ Priority #${i + 1}`;
  });
};

providers.forEach(p => {
  const card = document.createElement('div');
  card.className = 'provider-card';
  card.style.setProperty('--card-color', p.color);
  
  card.innerHTML = `
    <div class="provider-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="provider-name">${p.name}</span>
        <span class="status-pill status-idle" id="status-${p.id}">⚪ Idle</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="priority-btn" id="prio-${p.id}" onclick="togglePriority('${p.id}')">+ Priority</button>
        <span class="provider-badge ${p.type === 'bulk' ? 'badge-bulk' : 'badge-direct'}">${p.type} API</span>
      </div>
    </div>
    <p class="provider-desc">${p.desc}</p>
    <div class="input-group">
      <div class="input-header">
        <label for="key-${p.id}">${p.name} Key</label>
        <a href="${p.link}" target="_blank" class="link-btn">Get Key ↗</a>
      </div>
      <input type="password" id="key-${p.id}" data-provider-id="${p.id}" placeholder="Paste API Key here...">
    </div>
  `;
  container.appendChild(card);
});

// Live Health Stats Polling
async function updateLiveMetrics() {
  try {
    const res = await fetch('/api/health-stats');
    if (!res.ok) return;
    const data = await res.json();
    
    // Update top metrics bar
    if (data.metrics) {
      document.getElementById('metric-tokens').innerText = (data.metrics.totalTokensEstimated || 0).toLocaleString();
      document.getElementById('metric-saved').innerText = `$${(data.metrics.totalCostSavedUSD || 0).toFixed(2)}`;
    }
    
    // Update individual provider badges
    const cooldowns = data.cooldowns || {};
    providers.forEach(p => {
      const statusEl = document.getElementById(`status-${p.id}`);
      const inputEl = document.getElementById(`key-${p.id}`);
      if (!statusEl) return;
      
      const hasKey = inputEl && inputEl.value.trim().length > 0;
      if (cooldowns[p.id]) {
        statusEl.className = 'status-pill status-cooldown';
        statusEl.innerText = `🟡 Cooldown (${cooldowns[p.id]}s)`;
      } else if (hasKey) {
        statusEl.className = 'status-pill status-ready';
        statusEl.innerText = `🟢 Ready`;
      } else {
        statusEl.className = 'status-pill status-idle';
        statusEl.innerText = `⚪ Idle`;
      }
    });
  } catch (err) {}
}

setInterval(updateLiveMetrics, 3000);
updateLiveMetrics();

let generatedToken = "";

// Generate Ultimate API Key
document.getElementById('btn-generate-api').addEventListener('click', async () => {
  const payload = {};
  let hasKey = false;
  
  providers.forEach(p => {
    const val = document.getElementById(`key-${p.id}`).value.trim();
    if (val) {
      payload[p.id] = val;
      hasKey = true;
    }
  });

  if (!hasKey) {
    alert("Please provide at least one API Key from the global marketplace to merge!");
    return;
  }

  const btn = document.getElementById('btn-generate-api');
  btn.innerHTML = `<span class="btn-icon">⏳</span> COMPILING BRAIN (ENCRYPTING)...`;
  
  try {
    const response = await fetch('/api/register-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keys: payload,
        preferredOrder: preferredOrder
      })
    });

    const data = await response.json();

    if (data.success) {
      let finalEndpoint = data.endpoint;
      if (window.location.protocol === 'https:' && finalEndpoint.startsWith('http://')) {
        finalEndpoint = finalEndpoint.replace('http://', 'https://');
      }
      document.getElementById('val-endpoint').innerText = finalEndpoint;
      document.getElementById('val-token').innerText = data.virtualKey;
      generatedToken = data.virtualKey;

      // Persist generated virtual key and endpoint
      localStorage.setItem('venar_virtual_key', data.virtualKey);
      localStorage.setItem('venar_endpoint', finalEndpoint);

      const resultBox = document.getElementById('result-box');
      resultBox.classList.remove('hidden');
      resultBox.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert("Error: " + (data.error || "Failed to register keys"));
    }
  } catch (error) {
    console.error("Register key error: ", error);
    alert("Connection to backend server failed! Make sure the backend server is running.");
  } finally {
    btn.innerHTML = `<span class="btn-icon">⚡</span> COMPILE ULTIMATE MERGED API`;
  }
});

// Auto-Save and Restore Keys & State from localStorage
function saveKeysToStorage() {
  const saved = {};
  providers.forEach(p => {
    const val = document.getElementById(`key-${p.id}`)?.value.trim() || '';
    if (val) saved[p.id] = val;
  });
  localStorage.setItem('venar_saved_keys', JSON.stringify(saved));
  localStorage.setItem('venar_preferred_order', JSON.stringify(preferredOrder));
}

function restoreSavedState() {
  try {
    // 1. Restore input keys
    const savedKeys = JSON.parse(localStorage.getItem('venar_saved_keys') || '{}');
    Object.entries(savedKeys).forEach(([pid, val]) => {
      const input = document.getElementById(`key-${pid}`);
      if (input) input.value = val;
    });

    // 2. Restore preferred order
    const savedOrder = JSON.parse(localStorage.getItem('venar_preferred_order') || '[]');
    if (Array.isArray(savedOrder)) {
      savedOrder.forEach(id => {
        if (!preferredOrder.includes(id)) togglePriority(id);
      });
    }

    // 3. Restore generated token & result box
    const savedToken = localStorage.getItem('venar_virtual_key');
    const savedEndpoint = localStorage.getItem('venar_endpoint');
    if (savedToken) {
      generatedToken = savedToken;
      const tokEl = document.getElementById('val-token');
      const endEl = document.getElementById('val-endpoint');
      if (tokEl) tokEl.innerText = savedToken;
      if (endEl) endEl.innerText = savedEndpoint || `${window.location.origin}/v1/chat/completions`;

      const resultBox = document.getElementById('result-box');
      if (resultBox) resultBox.classList.remove('hidden');
    }
  } catch (e) {
    console.warn('Could not restore state from storage:', e);
  }
}

// Attach input change listener to all provider fields
providers.forEach(p => {
  const input = document.getElementById(`key-${p.id}`);
  if (input) {
    input.addEventListener('input', () => {
      saveKeysToStorage();
      updateLiveMetrics();
    });
  }
});

// Restore on startup
restoreSavedState();

// Clear All Keys helper
window.clearAllSavedKeys = function() {
  if (confirm("Are you sure you want to clear all entered API keys and reset your session?")) {
    localStorage.removeItem('venar_saved_keys');
    localStorage.removeItem('venar_preferred_order');
    localStorage.removeItem('venar_virtual_key');
    localStorage.removeItem('venar_endpoint');
    providers.forEach(p => {
      const input = document.getElementById(`key-${p.id}`);
      if (input) input.value = '';
    });
    preferredOrder.length = 0;
    providers.forEach(p => {
      const b = document.getElementById(`prio-${p.id}`);
      if (b) {
        b.classList.remove('active');
        b.innerText = "+ Priority";
      }
    });
    generatedToken = "";
    document.getElementById('result-box')?.classList.add('hidden');
    updateLiveMetrics();
    alert("All saved keys and session data cleared!");
  }
};

// Clipboard Helpers
window.copyText = function(elementId) {
  const textVal = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(textVal).then(() => {
    alert("Copied to clipboard!");
  }).catch(err => console.error("Failed to copy: ", err));
};

window.copyRawText = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied "${text}" to clipboard!`);
  }).catch(err => console.error("Failed to copy: ", err));
};

// ==========================================
// UNIVERSAL MODEL CATALOG & ROUTE DISCOVERY
// ==========================================
let allCatalogModels = [];
let activeCatalogFilter = 'all';

async function loadModelCatalog() {
  try {
    const res = await fetch('/api/models');
    if (res.ok) {
      const data = await res.json();
      allCatalogModels = data.models || [];
    }
  } catch (e) {
    console.warn("Using fallback catalog:", e);
  }
  renderCatalog();
}

function renderCatalog() {
  const container = document.getElementById('models-container');
  if (!container) return;

  const searchTerm = (document.getElementById('model-search-input')?.value || '').toLowerCase().trim();
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) clearBtn.classList.toggle('hidden', searchTerm.length === 0);

  const filtered = allCatalogModels.filter(m => {
    // Category pill filter
    if (activeCatalogFilter === 'free' && !m.tags.includes('free') && !m.routes.some(r => r.free)) return false;
    if (activeCatalogFilter === 'coding' && !m.tags.includes('coding')) return false;
    if (activeCatalogFilter === 'reasoning' && !m.tags.includes('reasoning')) return false;
    if (activeCatalogFilter === 'fast' && !m.tags.includes('fast')) return false;

    // Search query filter
    if (searchTerm) {
      const matchName = m.name.toLowerCase().includes(searchTerm);
      const matchId = m.id.toLowerCase().includes(searchTerm);
      const matchFamily = m.family.toLowerCase().includes(searchTerm);
      const matchDesc = m.desc.toLowerCase().includes(searchTerm);
      const matchTags = m.tags.some(t => t.toLowerCase().includes(searchTerm));
      const matchRoutes = m.routes.some(r => r.p.toLowerCase().includes(searchTerm) || (r.label && r.label.toLowerCase().includes(searchTerm)));
      return matchName || matchId || matchFamily || matchDesc || matchTags || matchRoutes;
    }
    return true;
  });

  const countBadge = document.getElementById('catalog-count-badge');
  if (countBadge) {
    countBadge.innerText = `${filtered.length} Frontier Model${filtered.length === 1 ? '' : 's'} Ready`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: rgba(255,255,255,0.7); border-radius: 16px;">
        <p style="font-size: 16px; font-weight: 700; color: #4b5563;">No models matched your search criteria.</p>
        <button onclick="clearModelSearch()" style="margin-top: 10px; background: #111827; color: white; border: none; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-weight: 700;">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => {
    const familyClass = `family-${m.family.toLowerCase()}`;
    const hasFreeRoute = m.routes.some(r => r.free);

    const routesPipelineHtml = m.routes.map((r, i) => `
      <span class="route-node ${r.free ? 'free-tier' : ''}" title="${r.label || r.p}">${r.p.toUpperCase()}</span>
      ${i < m.routes.length - 1 ? '<span class="route-arrow">➔</span>' : ''}
    `).join('');

    return `
      <div class="model-card">
        <div>
          <div class="model-card-top">
            <span class="model-family-badge ${familyClass}">${m.family}</span>
            <span class="model-badge-flag">${m.badge || ''}</span>
          </div>

          <h3 class="model-card-name">${m.name}</h3>

          <div class="model-card-id-row">
            <code class="model-id-code">${m.id}</code>
            <button class="copy-id-btn" onclick="copyRawText('${m.id}')" title="Copy Model ID">📋</button>
          </div>

          <p class="model-card-desc">${m.desc}</p>

          <div class="model-meta-pills">
            <span class="meta-pill">Context: ${m.context}</span>
            <span class="meta-pill">Speed: ${m.speed}</span>
            ${hasFreeRoute ? '<span class="meta-pill meta-free">🟢 100% Free Route</span>' : ''}
          </div>

          <div class="route-matrix-box">
            <div class="route-matrix-title">Multi-Cloud Fallback Route:</div>
            <div class="route-flow-pipeline">
              ${routesPipelineHtml}
            </div>
          </div>
        </div>

        <div class="model-card-actions">
          <button class="card-action-btn card-btn-test" onclick="selectModelInPlayground('${m.id}')">⚡ Test in Playground</button>
          <button class="card-action-btn card-btn-copy" onclick="copyRawText('${m.id}')">📋 Copy ID</button>
        </div>
      </div>
    `;
  }).join('');
}

window.clearModelSearch = function() {
  const input = document.getElementById('model-search-input');
  if (input) input.value = '';
  renderCatalog();
};

window.selectModelInPlayground = function(modelId) {
  const sel = document.getElementById('play-model-select');
  if (sel) {
    sel.value = modelId;
  }
  const input = document.getElementById('play-input');
  if (input && !input.value.trim()) {
    if (modelId.includes('coder') || modelId.includes('claude')) {
      input.value = "Write a high-performance LRU Cache class in TypeScript with O(1) get and set.";
    } else if (modelId.includes('r1') || modelId.includes('reasoning')) {
      input.value = "A bat and ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Explain step by step.";
    } else {
      input.value = "Explain quantum computing in 3 simple, brilliant bullet points.";
    }
  }
  const resultBox = document.getElementById('result-box');
  if (resultBox && resultBox.classList.contains('hidden')) {
    resultBox.classList.remove('hidden');
  }
  const playSection = document.querySelector('.test-playground');
  if (playSection) {
    playSection.scrollIntoView({ behavior: 'smooth' });
  }
  if (input) input.focus();
};

// Search input event
const searchInput = document.getElementById('model-search-input');
if (searchInput) {
  searchInput.addEventListener('input', () => renderCatalog());
}

// Filter pills events
const filterPills = document.querySelectorAll('.filter-pill');
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCatalogFilter = pill.getAttribute('data-filter') || 'all';
    renderCatalog();
  });
});

// Load catalog on startup
loadModelCatalog();

// Playground (Real-time SSE Streaming with Target Model Routing)
document.getElementById('btn-send-play').addEventListener('click', async () => {
  const promptInput = document.getElementById('play-input').value.trim();
  const outputBox = document.getElementById('play-output');
  const selectedModel = document.getElementById('play-model-select')?.value || 'auto';

  if (!promptInput) return alert("Please enter a test prompt first!");
  if (!generatedToken) return alert("Please generate your Ultimate Merged API Key first!");

  const targetLabel = selectedModel === 'auto' ? 'Auto-Route' : selectedModel;
  outputBox.innerText = `Connecting to Venar Engine (Routing: ${targetLabel}, Streaming live)...`;
  outputBox.style.color = "#a78bfa";

  try {
    const payload = {
      messages: [{ role: 'user', content: promptInput }],
      stream: true
    };
    if (selectedModel && selectedModel !== 'auto') {
      payload.model = selectedModel;
    }

    const response = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${generatedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Request failed" }));
      let errText = `[ROUTING EXHAUSTED] - Error: ${data.error || response.statusText}\n\n🔍 Upstream Provider Diagnostics:`;
      if (Array.isArray(data.reasons) && data.reasons.length > 0) {
        data.reasons.forEach(r => {
          errText += `\n❌ ${r}`;
        });
      } else {
        errText += `\n❌ No providers responded. Check that your pasted API keys are valid and active.`;
      }
      outputBox.innerText = errText;
      outputBox.style.color = "#f87171";
      return;
    }

    outputBox.innerText = "";
    outputBox.style.color = "#111827";

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data:')) {
          try {
            const data = JSON.parse(trimmed.slice(5).trim());
            const deltaText = data.choices?.[0]?.delta?.content;
            if (deltaText) {
              outputBox.innerText += deltaText;
              outputBox.scrollTop = outputBox.scrollHeight;
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    outputBox.innerText = `[NETWORK ERROR] - Failed to connect to proxy endpoint.`;
    outputBox.style.color = "#f87171";
  }
});
  
  // LOGIN LOGIC
  const loginForm = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');
  const loginSection = document.getElementById('login-section');
  const appSection = document.getElementById('app-section');
  
  function enterApp() {
      loginSection.classList.add('hidden');
      appSection.classList.remove('hidden');
      // Trigger a small fade-in animation for the app section
      appSection.style.opacity = 0;
      appSection.style.transition = "opacity 0.5s ease";
      setTimeout(() => appSection.style.opacity = 1, 50);
  }
  
  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const passcode = document.getElementById('password')?.value || '';
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner"></span>Verifying Access...';
      
      try {
        const res = await fetch('/api/verify-passcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          enterApp();
        } else {
          alert("Access Denied: " + (data.error || "Incorrect Passcode"));
        }
      } catch (err) {
        enterApp(); // Fallback for open local mode
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
  });
  
  window.handleSocialLogin = async function(provider) {
      const btns = document.querySelectorAll('.social-btn');
      btns.forEach(b => b.style.opacity = '0.5');
      
      // Simulate OAuth delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      enterApp();
  };

  const btnShowLogin = document.getElementById('btn-show-login');
  if (btnShowLogin) {
      btnShowLogin.addEventListener('click', () => {
          appSection.classList.add('hidden');
          loginSection.classList.remove('hidden');
          loginSection.style.opacity = 0;
          loginSection.style.transition = "opacity 0.5s ease";
          setTimeout(() => loginSection.style.opacity = 1, 50);
      });
  }

