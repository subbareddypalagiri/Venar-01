import { NeatGradient } from "https://esm.sh/@firecms/neat";
import { initParticleText } from "./particle-text.js";
import { getBrandIconSvg } from "./brand-icons.js";

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
        <div style="display: flex; gap: 6px; align-items: center;">
          <button class="verify-key-btn" id="verify-btn-${p.id}" onclick="verifySingleKey('${p.id}')">⚡ Verify</button>
          <a href="${p.link}" target="_blank" class="link-btn">Get Key ↗</a>
        </div>
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
let currentStudioMode = 'auto'; // 'auto' | 'dedicated'
let currentPinnedProvider = 'auto'; // 'auto' | provider key

window.setStudioMode = function(mode) {
  currentStudioMode = mode;
  const btnAuto = document.getElementById('btn-mode-auto');
  const btnDed = document.getElementById('btn-mode-dedicated');
  if (btnAuto) btnAuto.classList.toggle('active', mode === 'auto');
  if (btnDed) btnDed.classList.toggle('active', mode === 'dedicated');

  const telStatus = document.getElementById('telemetry-route-status');
  if (telStatus) {
    telStatus.innerText = mode === 'dedicated' 
      ? '🎯 Dedicated Pure Mode Active (Strict Model Isolation)' 
      : '🤖 Auto-Cascade Mode Active (Multi-Cloud Failover)';
  }
};

const providerPinSelect = document.getElementById('play-provider-pin');
if (providerPinSelect) {
  providerPinSelect.addEventListener('change', (e) => {
    currentPinnedProvider = e.target.value;
  });
}

window.triggerLiveModelSync = async function() {
  const btn = document.getElementById('btn-live-sync');
  const origHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = `<span class="spinner" style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span> Polling Free Models...`;
    btn.disabled = true;
  }

  try {
    const res = await fetch('/api/models/live-sync');
    const data = await res.json();
    if (data.success) {
      await loadModelCatalog();
      alert(`✨ Live Free Model Sync Complete!\n\nDiscovered ${data.totalLiveFree} live free models (+${data.newlyDiscovered} new models added).\nTotal verified catalog now active: ${data.totalCombined} models!`);
    } else {
      alert(`Live Sync Warning: ${data.error || 'Could not reach sync endpoint'}`);
    }
  } catch (e) {
    alert(`Sync error: ${e.message}`);
  } finally {
    if (btn) {
      btn.innerHTML = origHtml;
      btn.disabled = false;
    }
  }
};

function populateStudioModelSelect() {
  const select = document.getElementById('play-model-select');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '';

  const autoOpt = document.createElement('option');
  autoOpt.value = 'auto';
  autoOpt.innerText = '🤖 Auto-Route (Smart Category Cascade)';
  select.appendChild(autoOpt);

  const groups = {};
  allCatalogModels.forEach(m => {
    const fam = m.family || 'Other';
    if (!groups[fam]) groups[fam] = [];
    groups[fam].push(m);
  });

  const familyOrder = [
    'Google', 'Anthropic', 'OpenAI', 'Meta', 'DeepSeek', 'Qwen', 'Mistral', 'Cohere', 'Microsoft', 'NVIDIA', 'Liquid', 'Nous', 'Cognitive', 'Other'
  ];

  const sortedFamilies = Object.keys(groups).sort((a, b) => {
    const ia = familyOrder.indexOf(a);
    const ib = familyOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  sortedFamilies.forEach(fam => {
    const groupEl = document.createElement('optgroup');
    groupEl.label = `${fam} (${groups[fam].length} Models)`;
    groups[fam].forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      const freeTag = m.routes.some(r => r.free) ? ' [Free]' : '';
      opt.innerText = `${m.name}${freeTag} (${m.context}, ${m.speed})`;
      groupEl.appendChild(opt);
    });
    select.appendChild(groupEl);
  });

  if (currentVal && Array.from(select.options).some(o => o.value === currentVal)) {
    select.value = currentVal;
  }
}

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
  populateStudioModelSelect();
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
    if (activeCatalogFilter === 'google' && !m.family.toLowerCase().includes('google') && !m.routes.some(r => r.p === 'gemini')) return false;
    if (activeCatalogFilter === 'github' && !m.routes.some(r => r.p === 'github')) return false;
    if (activeCatalogFilter === 'groq' && !m.routes.some(r => r.p === 'groq' || r.p === 'cerebras')) return false;
    if (activeCatalogFilter === 'deepseek' && !m.family.toLowerCase().includes('deepseek') && !m.id.includes('deepseek')) return false;
    if (activeCatalogFilter === 'openrouter' && !m.routes.some(r => r.p === 'openrouter')) return false;

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
    countBadge.innerText = `${filtered.length} Verified Free Model${filtered.length === 1 ? '' : 's'} Ready`;
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
      <span class="route-node ${r.free ? 'free-tier' : ''}" title="${r.label || r.p}">
        ${getBrandIconSvg(r.p, 13)}
        <span>${r.p.toUpperCase()}</span>
      </span>
      ${i < m.routes.length - 1 ? '<span class="route-arrow">➔</span>' : ''}
    `).join('');

    return `
      <div class="model-card">
        <div>
          <div class="model-card-top">
            <span class="model-family-badge ${familyClass}">
              ${getBrandIconSvg(m.family, 16)}
              <span>${m.family}</span>
            </span>
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
            <div class="route-matrix-title">Multi-Cloud Route Matrix:</div>
            <div class="route-flow-pipeline">
              ${routesPipelineHtml}
            </div>
          </div>
        </div>

        <div class="model-card-actions">
          <button class="card-action-btn card-btn-test" onclick="selectModelInPlayground('${m.id}')">⚡ Test in Studio</button>
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

// ==========================================
// 1-CLICK PROVIDER KEY HEALTH AUDITOR
// ==========================================
window.verifySingleKey = async function(providerId) {
  const inputEl = document.getElementById(`key-${providerId}`);
  const btnEl = document.getElementById(`verify-btn-${providerId}`);
  const statusEl = document.getElementById(`status-${providerId}`);

  const rawKey = inputEl ? inputEl.value.trim() : '';
  if (!rawKey) {
    alert("Please paste an API key first to verify!");
    if (inputEl) inputEl.focus();
    return;
  }

  const origText = btnEl.innerText;
  btnEl.innerText = "⏳ Ping...";
  btnEl.disabled = true;

  try {
    const res = await fetch('/api/verify-provider-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: providerId, key: rawKey })
    });

    const data = await res.json();
    if (res.ok && data.valid) {
      btnEl.innerText = "✅ Valid";
      btnEl.classList.add('verified');
      if (statusEl) {
        statusEl.className = 'status-pill status-ready';
        statusEl.innerText = `🟢 Ready (${data.latencyMs}ms)`;
      }
      saveKeysToStorage();
      await ensureActiveToken(); // Seamlessly compile stateless key in background
    } else {
      btnEl.innerText = "❌ Failed";
      if (statusEl) {
        statusEl.className = 'status-pill status-cooldown';
        statusEl.innerText = `❌ Invalid Key`;
      }
      alert(`Key Verification Failed for ${providerId.toUpperCase()}:\n${data.error || 'Invalid credentials or expired quota.'}`);
    }
  } catch (err) {
    btnEl.innerText = "⚠️ Error";
    alert(`Network error verifying key: ${err.message}`);
  } finally {
    setTimeout(() => {
      btnEl.disabled = false;
      if (!btnEl.classList.contains('verified')) btnEl.innerText = origText;
    }, 2500);
  }
};

// ==========================================
// DEVELOPER SDK INTEGRATION HUB
// ==========================================
let activeSdkTab = 'cursor';

function getActiveEndpoint() {
  const ep = localStorage.getItem('venar_endpoint');
  if (ep) return ep;
  return `${window.location.origin}/v1/chat/completions`;
}

function getActiveToken() {
  return generatedToken || localStorage.getItem('venar_virtual_key') || 'sk-merged-v2-YOUR_ENCRYPTED_GATEWAY_TOKEN';
}

function updateSdkSnippet() {
  const display = document.getElementById('sdk-code-display');
  if (!display) return;

  const endpoint = getActiveEndpoint();
  const baseUrl = endpoint.replace('/chat/completions', '');
  const token = getActiveToken();

  if (activeSdkTab === 'cursor') {
    display.innerText = `// In Cursor / VS Code Cline / Continue settings:
{
  "openai.apiBase": "${baseUrl}",
  "openai.apiKey": "${token}",
  "openai.model": "claude-3-5-sonnet" // or "deepseek-r1", "gpt-4o", "qwen-2-5-coder-32b"
}`;
  } else if (activeSdkTab === 'python') {
    display.innerText = `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${token}"
)

# Stream DeepSeek R1 or Claude 3.5 with multi-cloud fallback:
response = client.chat.completions.create(
    model="deepseek-r1",
    messages=[{"role": "user", "content": "Write a high-performance LRU Cache"}],
    stream=True
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`;
  } else if (activeSdkTab === 'node') {
    display.innerText = `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "${baseUrl}",
  apiKey: "${token}"
});

const stream = await openai.chat.completions.create({
  model: "claude-3-5-sonnet",
  messages: [{ role: "user", content: "Optimize this algorithm" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`;
  } else if (activeSdkTab === 'curl') {
    display.innerText = `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Hello Venar!"}],
    "stream": true
  }'`;
  }
}

window.switchSdkTab = function(tabName) {
  activeSdkTab = tabName;
  document.querySelectorAll('.sdk-tab').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
  });
  updateSdkSnippet();
};

document.querySelectorAll('.sdk-tab').forEach(b => {
  b.addEventListener('click', () => switchSdkTab(b.getAttribute('data-tab')));
});

window.copySdkCode = function() {
  const code = document.getElementById('sdk-code-display')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    alert("Integration code snippet copied to clipboard!");
  }).catch(e => console.error("Copy failed:", e));
};

updateSdkSnippet();

// ==========================================
// FAANG-GRADE MULTI-TURN AI STUDIO & CASCADE
// ==========================================
let conversationMessages = [];
let activeAbortController = null;

// Markdown & Code Highlighter formatter
function formatMarkdown(raw) {
  if (!raw) return "";
  let html = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const codeId = 'code-' + Math.random().toString(36).substring(7);
    return `
      <div class="code-block-wrapper" style="position: relative; margin: 12px 0;">
        <div style="display: flex; justify-content: space-between; background: #1e293b; padding: 6px 12px; border-radius: 8px 8px 0 0; font-size: 11px; font-weight: 700; color: #94a3b8;">
          <span>${lang || 'CODE'}</span>
          <button onclick="copyCodeSnippet('${codeId}')" style="background: rgba(255,255,255,0.15); border: none; color: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">📋 Copy</button>
        </div>
        <pre style="margin: 0; border-radius: 0 0 8px 8px;"><code id="${codeId}">${code}</code></pre>
      </div>
    `;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

window.copyCodeSnippet = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    alert("Code copied to clipboard!");
  });
};

// Seamless Token Auto-Compiler: Ensures user always has a valid token
async function ensureActiveToken() {
  const payload = {};
  let keyCount = 0;
  providers.forEach(p => {
    const val = document.getElementById(`key-${p.id}`)?.value.trim();
    if (val) {
      payload[p.id] = val;
      keyCount++;
    }
  });

  if (keyCount > 0) {
    try {
      const res = await fetch('/api/register-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: payload, preferredOrder })
      });
      const data = await res.json();
      if (data.success) {
        generatedToken = data.virtualKey;
        localStorage.setItem('venar_virtual_key', data.virtualKey);
        localStorage.setItem('venar_endpoint', data.endpoint);
        const tokEl = document.getElementById('val-token');
        if (tokEl) tokEl.innerText = data.virtualKey;
        const endEl = document.getElementById('val-endpoint');
        if (endEl) endEl.innerText = data.endpoint;
        updateSdkSnippet();
        return { token: data.virtualKey, payload };
      }
    } catch (e) {
      console.warn("Auto-compile registration error:", e);
    }
  }

  // Fallback to existing saved token
  const existingToken = generatedToken || localStorage.getItem('venar_virtual_key') || '';
  return { token: existingToken, payload };
}

// Model Catalog "Test in Playground" selection
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

// Search & filter events
const searchInput = document.getElementById('model-search-input');
if (searchInput) {
  searchInput.addEventListener('input', () => renderCatalog());
}

const filterPills = document.querySelectorAll('.filter-pill');
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCatalogFilter = pill.getAttribute('data-filter') || 'all';
    renderCatalog();
  });
});

loadModelCatalog();

// Studio Parameters Drawer Toggle
const btnToggleParams = document.getElementById('btn-toggle-params');
const paramsDrawer = document.getElementById('studio-params-drawer');
if (btnToggleParams && paramsDrawer) {
  btnToggleParams.addEventListener('click', () => {
    paramsDrawer.classList.toggle('hidden');
    btnToggleParams.classList.toggle('active');
  });
}

// Sliders live values
const tempInput = document.getElementById('param-temp');
if (tempInput) {
  tempInput.addEventListener('input', () => {
    document.getElementById('val-param-temp').innerText = tempInput.value;
  });
}

const maxTokensInput = document.getElementById('param-max-tokens');
if (maxTokensInput) {
  maxTokensInput.addEventListener('input', () => {
    document.getElementById('val-param-max-tokens').innerText = maxTokensInput.value;
  });
}

// Clear Chat Thread
const btnClearChat = document.getElementById('btn-clear-chat');
if (btnClearChat) {
  btnClearChat.addEventListener('click', () => {
    if (conversationMessages.length > 0 && confirm("Clear conversation thread?")) {
      conversationMessages = [];
      const thread = document.getElementById('studio-chat-thread');
      if (thread) {
        thread.innerHTML = `
          <div class="chat-welcome-banner" id="chat-welcome-banner">
            <div class="welcome-icon">✨</div>
            <h4>Welcome to Venar Universal AI Studio</h4>
            <p>Pick a benchmark preset above or type any question below. Real-time token streaming and multi-cloud cascade tracking will appear live.</p>
          </div>
        `;
      }
      document.getElementById('telemetry-route-status').innerText = "Thread cleared • Gateway Ready";
    }
  });
}

// Stop current generation
window.stopCurrentGeneration = function() {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
};

// Benchmark Quick Presets
window.applyBenchmarkPreset = function(type) {
  const modelSel = document.getElementById('play-model-select');
  const inputEl = document.getElementById('play-input');
  if (!inputEl) return;

  if (type === 'coder') {
    if (modelSel) modelSel.value = 'qwen-2-5-coder-32b';
    inputEl.value = "Write a high-performance LRU Cache class in TypeScript with generic types, O(1) operations, and zero dependencies.";
  } else if (type === 'reasoning') {
    if (modelSel) modelSel.value = 'deepseek-r1';
    inputEl.value = "Solve this step-by-step: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Verify with mathematical proof.";
  } else if (type === 'speed') {
    if (modelSel) modelSel.value = 'llama-3-1-8b';
    inputEl.value = "Write an insightful 250-word overview on how modern AI Gateway architectures handle multi-cloud cascades and rate-limit mitigation.";
  } else if (type === 'quantum') {
    if (modelSel) modelSel.value = 'claude-3-5-sonnet';
    inputEl.value = "Explain Quantum Entanglement and Superposition in exactly 3 brilliant, intuitive bullet points for senior engineers.";
  }

  // Scroll to studio and trigger send
  const studio = document.querySelector('.studio-container');
  if (studio) studio.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('btn-send-play')?.click();
};

// Auto-expanding textarea
const playTextarea = document.getElementById('play-input');
if (playTextarea) {
  playTextarea.addEventListener('input', () => {
    playTextarea.style.height = 'auto';
    playTextarea.style.height = Math.min(playTextarea.scrollHeight, 140) + 'px';
  });

  playTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('btn-send-play')?.click();
    }
  });
}

// Main AI Studio Send Runner (Multi-Turn Conversational SSE)
document.getElementById('btn-send-play').addEventListener('click', async () => {
  const inputEl = document.getElementById('play-input');
  const userText = (inputEl?.value || '').trim();
  const thread = document.getElementById('studio-chat-thread');
  const sendBtn = document.getElementById('btn-send-play');
  const stopBtn = document.getElementById('btn-stop-play');
  const selectedModel = document.getElementById('play-model-select')?.value || 'auto';
  const systemPrompt = document.getElementById('param-system-prompt')?.value.trim();
  const temperature = parseFloat(document.getElementById('param-temp')?.value || '0.7');
  const maxTokens = parseInt(document.getElementById('param-max-tokens')?.value || '2048');
  const isStreaming = document.getElementById('param-stream')?.checked ?? true;

  if (!userText) return alert("Please enter a prompt first!");

  // Ensure active token (auto-compiles stateless token from input fields if available)
  const { token, payload: clientKeys } = await ensureActiveToken();

  if (!token && (!clientKeys || Object.keys(clientKeys).length === 0)) {
    alert("🔑 Quick Start: Please paste at least one free API key (like Groq, Google AI Studio, or GitHub PAT) in the marketplace above to begin streaming!");
    document.getElementById('providers-container')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // Hide welcome banner on first message
  const welcomeBanner = document.getElementById('chat-welcome-banner');
  if (welcomeBanner) welcomeBanner.classList.add('hidden');

  // 1. Append User Message Bubble
  conversationMessages.push({ role: 'user', content: userText });
  inputEl.value = "";
  inputEl.style.height = 'auto';

  const userTurnEl = document.createElement('div');
  userTurnEl.className = 'chat-turn user';
  userTurnEl.innerHTML = `
    <div class="chat-avatar user-avatar">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    </div>
    <div class="chat-bubble">${formatMarkdown(userText)}</div>
  `;
  thread.appendChild(userTurnEl);

  // 2. Append Assistant Message Bubble (Placeholder for Streaming)
  const assistantTurnEl = document.createElement('div');
  assistantTurnEl.className = 'chat-turn assistant';
  const bubbleId = 'bubble-' + Math.random().toString(36).substring(7);
  assistantTurnEl.innerHTML = `
    <div class="chat-avatar assistant-avatar" id="avatar-${bubbleId}">
      ${getBrandIconSvg(selectedModel, 20)}
    </div>
    <div class="chat-bubble" id="${bubbleId}"><span class="spinner"></span> Routing cascade...</div>
  `;
  thread.appendChild(assistantTurnEl);
  thread.scrollTop = thread.scrollHeight;

  // Telemetry UI
  const telPulse = document.querySelector('.telemetry-pulse');
  const telStatus = document.getElementById('telemetry-route-status');
  const telProvider = document.getElementById('tel-provider');
  const telLatency = document.getElementById('tel-latency');
  const telSpeed = document.getElementById('tel-speed');

  if (telPulse) telPulse.className = 'telemetry-pulse pulse-running';
  if (telStatus) telStatus.innerText = `Connecting ➔ Target: ${selectedModel} (Mode: ${currentStudioMode})...`;

  sendBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');

  activeAbortController = new AbortController();
  const startTime = Date.now();
  let accumulatedText = "";
  let streamTokenCount = 0;
  let routedProvider = "";
  let routedModel = selectedModel;

  try {
    const reqBody = {
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...conversationMessages
      ],
      stream: isStreaming,
      temperature,
      max_tokens: maxTokens,
      mode: currentStudioMode
    };
    if (selectedModel && selectedModel !== 'auto') {
      reqBody.model = selectedModel;
    }
    if (currentPinnedProvider && currentPinnedProvider !== 'auto') {
      reqBody.provider = currentPinnedProvider;
    }

    const reqHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-venar-client-keys': encodeURIComponent(JSON.stringify(clientKeys || {})),
      'x-venar-mode': currentStudioMode
    };
    if (currentPinnedProvider && currentPinnedProvider !== 'auto') {
      reqHeaders['x-venar-provider'] = currentPinnedProvider;
    }

    const response = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(reqBody),
      signal: activeAbortController.signal
    });

    // Check upstream response headers
    routedProvider = response.headers.get('x-venar-provider') || '';
    const headerModel = response.headers.get('x-venar-model');
    if (headerModel) routedModel = headerModel;
    let isFallback = response.headers.get('x-venar-fallback') === 'true';

    // Update avatar with real routed provider logo
    const avatarEl = document.getElementById(`avatar-${bubbleId}`);
    if (avatarEl && routedProvider) {
      avatarEl.innerHTML = getBrandIconSvg(routedProvider, 20);
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "Request failed" }));
      let failHtml = `<strong style="color: #dc2626;">[ROUTING EXHAUSTED]</strong><br>${errData.error || response.statusText}`;
      if (Array.isArray(errData.reasons) && errData.reasons.length > 0) {
        failHtml += `<div style="margin-top: 8px; font-size: 12px; color: #b91c1c;"><strong>Diagnostics:</strong><br>${errData.reasons.map(r => `• ${r}`).join('<br>')}</div>`;
      }
      document.getElementById(bubbleId).innerHTML = failHtml;
      if (telPulse) telPulse.className = 'telemetry-pulse pulse-failover';
      if (telStatus) telStatus.innerText = "❌ All candidate routes failed or were rate limited.";
      return;
    }

    // -------------------------------------------------------------
    // STREAMING FLOW (SSE)
    // -------------------------------------------------------------
    if (isStreaming) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const bubbleEl = document.getElementById(bubbleId);
      bubbleEl.innerHTML = "";

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

              // Telemetry chunk
              if (data.venar_telemetry) {
                if (data.venar_telemetry.provider) routedProvider = data.venar_telemetry.provider;
                if (data.venar_telemetry.model) routedModel = data.venar_telemetry.model;
                if (data.venar_telemetry.is_fallback) isFallback = true;
              }

              const deltaText = data.choices?.[0]?.delta?.content;
              if (deltaText) {
                accumulatedText += deltaText;
                streamTokenCount += 1;
                bubbleEl.innerHTML = formatMarkdown(accumulatedText);
                thread.scrollTop = thread.scrollHeight;
              }
            } catch (e) {}
          }
        }
      }
    } 
    // -------------------------------------------------------------
    // NON-STREAMING FLOW (JSON)
    // -------------------------------------------------------------
    else {
      const jsonRes = await response.json();
      accumulatedText = jsonRes.choices?.[0]?.message?.content || "";
      streamTokenCount = Math.ceil(accumulatedText.length / 4);
      if (jsonRes.venar_telemetry?.provider) routedProvider = jsonRes.venar_telemetry.provider;
      if (jsonRes.venar_telemetry?.model) routedModel = jsonRes.venar_telemetry.model;
      if (jsonRes.venar_telemetry?.is_fallback) isFallback = true;
      document.getElementById(bubbleId).innerHTML = formatMarkdown(accumulatedText);
    }

    // Record response in conversation history for multi-turn continuity
    conversationMessages.push({ role: 'assistant', content: accumulatedText });

    // Update Telemetry Metrics
    const totalDurationMs = Date.now() - startTime;
    const tokensPerSec = totalDurationMs > 0 ? Math.round((streamTokenCount / (totalDurationMs / 1000))) : 0;

    if (telPulse) telPulse.className = 'telemetry-pulse';
    if (currentStudioMode === 'dedicated') {
      telStatus.innerHTML = `<span style="background: rgba(99, 102, 241, 0.2); color: #6366f1; padding: 2px 8px; border-radius: 4px; font-weight: 700; margin-right: 6px;">🎯 Dedicated Pure</span> Isolated to <strong>${routedModel}</strong> via <strong>${routedProvider}</strong>`;
    } else if (isFallback) {
      telStatus.innerHTML = `<span style="background: rgba(245, 158, 11, 0.2); color: #d97706; padding: 2px 8px; border-radius: 4px; font-weight: 700; margin-right: 6px;">⚡ Auto-Cascaded</span> Routed via <strong>${routedProvider}</strong> (${routedModel})`;
    } else {
      telStatus.innerHTML = `<span style="background: rgba(16, 185, 129, 0.2); color: #059669; padding: 2px 8px; border-radius: 4px; font-weight: 700; margin-right: 6px;">🟢 Primary Route</span> Completed via <strong>${routedProvider || 'Venar Gateway'}</strong> (${routedModel})`;
    }
    if (telProvider) telProvider.innerText = `Provider: ${routedProvider || 'Active Route'}`;
    if (telLatency) telLatency.innerText = `Latency: ${totalDurationMs}ms`;
    if (telSpeed) telSpeed.innerText = `Speed: ~${tokensPerSec} t/s`;

  } catch (err) {
    if (err.name === 'AbortError') {
      document.getElementById(bubbleId).innerHTML += `<br><span style="color: #d97706; font-size: 12px;">[Generation stopped by user]</span>`;
      if (telStatus) telStatus.innerText = "Generation stopped by user";
    } else {
      document.getElementById(bubbleId).innerHTML = `<span style="color: #dc2626;">[Connection Error] - ${err.message}</span>`;
      if (telStatus) telStatus.innerText = "Network failure";
    }
  } finally {
    sendBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    activeAbortController = null;
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

