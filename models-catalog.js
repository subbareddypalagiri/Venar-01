// ==============================================================================
// VENAR ENTERPRISE UNIVERSAL FREE MODEL REGISTRY (85+ VERIFIED FREE MODELS)
// Multi-cloud route redundancy across Google AI Studio, GitHub Models Azure PAT,
// Groq Cloud, Cerebras, OpenRouter Live Free, Mistral AI, Cohere, SiliconFlow, HF.
// ==============================================================================

const MODEL_CATALOG = [
  // --------------------------------------------------------------------------
  // 1. GOOGLE AI STUDIO (GEMINI 2.5 / 2.0 / 1.5 & GEMMA SUITE - 100% FREE TIER)
  // --------------------------------------------------------------------------
  {
    id: 'gemini-2.5-flash',
    name: 'Google Gemini 2.5 Flash',
    family: 'Google',
    badge: '🚀 Next-Gen Frontier',
    context: '1M',
    speed: '~140 t/s',
    tags: ['general', 'fast', 'free', 'popular', 'flagship', 'google'],
    desc: 'Googles newest frontier model with 1M token context, real-time multimodal reasoning, and 1,500 daily requests free.',
    routes: [
      { p: 'gemini', m: 'gemini-2.5-flash', free: true, label: 'Google AI Studio (Gemini 2.5 Flash)' },
      { p: 'gemini', m: 'gemini-1.5-flash', free: true, label: 'Google AI Studio (Flash Fallback)' },
      { p: 'openrouter', m: 'google/gemini-2.0-flash-exp:free', free: true, label: 'OpenRouter Free Gemini' }
    ]
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Google Gemini 2.5 Pro',
    family: 'Google',
    badge: '👑 Frontier Logic & Code',
    context: '2M',
    speed: '~80 t/s',
    tags: ['reasoning', 'coding', 'free', 'popular', 'flagship', 'google'],
    desc: 'Googles flagship reasoning and deep coding model with industry-leading 2-million token window.',
    routes: [
      { p: 'gemini', m: 'gemini-2.5-pro', free: true, label: 'Google AI Studio (Gemini 2.5 Pro)' },
      { p: 'gemini', m: 'gemini-1.5-pro', free: true, label: 'Google AI Studio (1.5 Pro)' },
      { p: 'openrouter', m: 'google/gemini-2.0-pro-exp-02-05:free', free: true, label: 'OpenRouter Free Pro Exp' }
    ]
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Google Gemini 2.0 Flash',
    family: 'Google',
    badge: '⚡ Ultra-Fast 1M',
    context: '1M',
    speed: '~165 t/s',
    tags: ['fast', 'general', 'free', 'popular', 'google'],
    desc: 'Sub-second first-token latency, multimodal audio/vision inputs, and massive context.',
    routes: [
      { p: 'gemini', m: 'gemini-2.0-flash', free: true, label: 'Google AI Studio Direct' },
      { p: 'gemini', m: 'gemini-2.5-flash', free: true, label: 'Google AI Studio 2.5' },
      { p: 'openrouter', m: 'google/gemini-2.0-flash-exp:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'gemini-2.0-flash-thinking',
    name: 'Google Gemini 2.0 Flash Thinking',
    family: 'Google',
    badge: '🧠 Native CoT Reasoning',
    context: '1M',
    speed: '~110 t/s',
    tags: ['reasoning', 'coding', 'free', 'popular', 'google'],
    desc: 'Gemini reasoning variant generating complete verifiable chain-of-thought tokens before answering.',
    routes: [
      { p: 'gemini', m: 'gemini-2.0-flash-thinking-exp-01-21', free: true, label: 'Google AI Studio Thinking Exp' },
      { p: 'openrouter', m: 'google/gemini-2.0-flash-thinking-exp:free', free: true, label: 'OpenRouter Free CoT' }
    ]
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Google Gemini 2.0 Flash Lite',
    family: 'Google',
    badge: '💨 Hyper-Speed Edge',
    context: '1M',
    speed: '~210 t/s',
    tags: ['fast', 'free', 'google'],
    desc: 'Cost-efficiency champion designed for low-latency batch analysis and high-frequency agents.',
    routes: [
      { p: 'gemini', m: 'gemini-2.0-flash-lite', free: true, label: 'Google AI Studio Direct' },
      { p: 'gemini', m: 'gemini-2.5-flash', free: true, label: 'Google AI Studio Fallback' }
    ]
  },
  {
    id: 'gemini-2.0-pro-exp',
    name: 'Google Gemini 2.0 Pro Experimental',
    family: 'Google',
    badge: '🔬 Experimental Flagship',
    context: '2M',
    speed: '~75 t/s',
    tags: ['reasoning', 'coding', 'free', 'google'],
    desc: 'Google AI Studios experimental 2.0 Pro checkpoint for complex world-knowledge tasks.',
    routes: [
      { p: 'gemini', m: 'gemini-2.0-pro-exp-02-05', free: true, label: 'Google AI Studio Direct' },
      { p: 'openrouter', m: 'google/gemini-2.0-pro-exp-02-05:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Google Gemini 1.5 Pro',
    family: 'Google',
    badge: '📚 2M Context King',
    context: '2M',
    speed: '~70 t/s',
    tags: ['reasoning', 'coding', 'free', 'google'],
    desc: 'Battle-tested 2-million context window capable of ingesting entire GitHub repositories.',
    routes: [
      { p: 'gemini', m: 'gemini-1.5-pro', free: true, label: 'Google AI Studio Direct' },
      { p: 'gemini', m: 'gemini-2.5-flash', free: true, label: 'Google AI Studio Fallback' }
    ]
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Google Gemini 1.5 Flash',
    family: 'Google',
    badge: '⚡ Production Workhorse',
    context: '1M',
    speed: '~130 t/s',
    tags: ['fast', 'general', 'free', 'google'],
    desc: 'Extremely reliable multi-modal production model with 1,500 daily requests free.',
    routes: [
      { p: 'gemini', m: 'gemini-1.5-flash', free: true, label: 'Google AI Studio Direct' },
      { p: 'gemini', m: 'gemini-2.5-flash', free: true, label: 'Google AI Studio Fallback' }
    ]
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Google Gemini 1.5 Flash 8B',
    family: 'Google',
    badge: '⚡ Edge High-Throughput',
    context: '1M',
    speed: '~180 t/s',
    tags: ['fast', 'free', 'google'],
    desc: 'Smallest, fastest Gemini variant engineered for high-volume structured data extraction.',
    routes: [
      { p: 'gemini', m: 'gemini-1.5-flash-8b', free: true, label: 'Google AI Studio Direct' }
    ]
  },
  {
    id: 'gemma-2-27b-it',
    name: 'Google Gemma 2 27B',
    family: 'Google',
    badge: '💎 Open Weights Champion',
    context: '8K',
    speed: '~150 t/s',
    tags: ['coding', 'reasoning', 'free', 'google'],
    desc: 'Googles premier open-weights model outperforming many 70B parameter alternatives.',
    routes: [
      { p: 'gemini', m: 'gemma-2-27b-it', free: true, label: 'Google AI Studio Direct' },
      { p: 'groq', m: 'gemma2-9b-it', free: true, label: 'Groq Cloud Gemma' }
    ]
  },
  {
    id: 'gemma-2-9b-it',
    name: 'Google Gemma 2 9B',
    family: 'Google',
    badge: '⚡ Lightweight Powerhouse',
    context: '8K',
    speed: '~380 t/s',
    tags: ['fast', 'free', 'google'],
    desc: 'Lightweight Google open architecture running at lightning speeds on Groq LPUs.',
    routes: [
      { p: 'groq', m: 'gemma2-9b-it', free: true, label: 'Groq Cloud (Free LPU)' },
      { p: 'gemini', m: 'gemma-2-9b-it', free: true, label: 'Google AI Studio' },
      { p: 'openrouter', m: 'google/gemma-2-9b-it:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'gemma-4-31b-it',
    name: 'Google Gemma 4 31B',
    family: 'Google',
    badge: '🔮 Frontier Open Release',
    context: '32K',
    speed: '~90 t/s',
    tags: ['reasoning', 'coding', 'free', 'google'],
    desc: 'Next-generation Gemma weights with enhanced instruction compliance and coding fluency.',
    routes: [
      { p: 'openrouter', m: 'google/gemma-4-31b-it:free', free: true, label: 'OpenRouter Free' }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. GITHUB MODELS (AZURE AI INFERENCE - 100% FREE WITH GITHUB PAT ghp_...)
  // Zero Credit Card Required - Free Tier For All Developers!
  // --------------------------------------------------------------------------
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    family: 'Anthropic',
    badge: '👑 Flagship Coder',
    context: '200K',
    speed: '~85 t/s',
    tags: ['coding', 'reasoning', 'free', 'popular', 'flagship', 'github', 'anthropic'],
    desc: 'The gold standard in software engineering, complex reasoning, and full system refactoring.',
    routes: [
      { p: 'github', m: 'Claude-3.5-Sonnet', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openrouter', m: 'anthropic/claude-3.5-sonnet', free: false, label: 'OpenRouter Direct' },
      { p: 'anthropic', m: 'claude-3-5-sonnet-20241022', free: false, label: 'Anthropic Direct' },
      { p: 'openrouter', m: 'deepseek/deepseek-r1:free', free: true, label: 'OpenRouter Free DeepSeek Fallback' }
    ]
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    family: 'Anthropic',
    badge: '⚡ Lightning Anthropic',
    context: '200K',
    speed: '~145 t/s',
    tags: ['fast', 'coding', 'free', 'github', 'anthropic'],
    desc: 'Ultra-fast Anthropic model matching Claude 3 Opus benchmarks with near-instant streaming.',
    routes: [
      { p: 'github', m: 'Claude-3.5-Haiku', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openrouter', m: 'anthropic/claude-3-5-haiku', free: false, label: 'OpenRouter' },
      { p: 'anthropic', m: 'claude-3-5-haiku-20241022', free: false, label: 'Anthropic Direct' }
    ]
  },
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5.1',
    family: 'Anthropic',
    badge: '🔮 Frontier Creative',
    context: '200K',
    speed: '~90 t/s',
    tags: ['general', 'reasoning', 'popular', 'flagship', 'anthropic'],
    desc: 'Anthropic creative frontier architecture for expressive synthesis, writing, and high-fidelity nuance.',
    routes: [
      { p: 'openrouter', m: 'anthropic/claude-fable-5.1', free: false, label: 'OpenRouter' },
      { p: 'openrouter', m: 'anthropic/claude-3.5-sonnet', free: false, label: 'OpenRouter Fallback' },
      { p: 'github', m: 'Claude-3.5-Sonnet', free: true, label: 'GitHub Models Free Sonnet' }
    ]
  },
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    family: 'Anthropic',
    badge: '👑 Deep Synthesis',
    context: '200K',
    speed: '~65 t/s',
    tags: ['reasoning', 'coding', 'popular', 'flagship', 'anthropic'],
    desc: 'Peak Anthropic intellectual depth for multi-disciplinary research and massive codebase reviews.',
    routes: [
      { p: 'openrouter', m: 'anthropic/claude-opus-5', free: false, label: 'OpenRouter' },
      { p: 'github', m: 'Claude-3.5-Sonnet', free: true, label: 'GitHub Models Free Sonnet' }
    ]
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    family: 'OpenAI',
    badge: '🌟 Omnimodal Peak',
    context: '128K',
    speed: '~95 t/s',
    tags: ['general', 'reasoning', 'coding', 'free', 'popular', 'flagship', 'github', 'openai'],
    desc: 'OpenAIs flagship omni-model combining state-of-the-art vision, text, and multimodal reasoning.',
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
    speed: '~140 t/s',
    tags: ['fast', 'general', 'free', 'popular', 'github', 'openai'],
    desc: 'High-speed, cost-effective multimodal model with top-tier benchmarks across code and logic.',
    routes: [
      { p: 'github', m: 'gpt-4o-mini', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openai', m: 'gpt-4o-mini', free: false, label: 'OpenAI Direct' },
      { p: 'openrouter', m: 'openai/gpt-4o-mini', free: false, label: 'OpenRouter' }
    ]
  },
  {
    id: 'o1',
    name: 'OpenAI o1 Reasoning',
    family: 'OpenAI',
    badge: '🧠 Frontier STEM Solver',
    context: '128K',
    speed: '~60 t/s',
    tags: ['reasoning', 'coding', 'free', 'flagship', 'github', 'openai'],
    desc: 'Trained with reinforcement learning for complex multi-step physics, math, and architecture problems.',
    routes: [
      { p: 'github', m: 'o1', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openai', m: 'o1', free: false, label: 'OpenAI Direct' }
    ]
  },
  {
    id: 'o1-mini',
    name: 'OpenAI o1-mini',
    family: 'OpenAI',
    badge: '⚡ Fast Reasoning',
    context: '128K',
    speed: '~110 t/s',
    tags: ['reasoning', 'coding', 'free', 'github', 'openai'],
    desc: 'Fast, cost-efficient reasoning model optimized for competitive programming and STEM tasks.',
    routes: [
      { p: 'github', m: 'o1-mini', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openai', m: 'o1-mini', free: false, label: 'OpenAI Direct' }
    ]
  },
  {
    id: 'o1-preview',
    name: 'OpenAI o1-preview',
    family: 'OpenAI',
    badge: '🔬 Deep Deliberation',
    context: '128K',
    speed: '~55 t/s',
    tags: ['reasoning', 'free', 'github', 'openai'],
    desc: 'OpenAIs foundational deliberation model exploring full thought hypotheses prior to generation.',
    routes: [
      { p: 'github', m: 'o1-preview', free: true, label: 'GitHub Models (Free Azure PAT)' }
    ]
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    family: 'OpenAI',
    badge: '🚀 Next-Gen o3 Solver',
    context: '200K',
    speed: '~120 t/s',
    tags: ['reasoning', 'coding', 'free', 'flagship', 'github', 'openai'],
    desc: 'The latest iteration of OpenAIs reasoning series with high STEM score and rapid generation.',
    routes: [
      { p: 'github', m: 'o3-mini', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openai', m: 'o3-mini', free: false, label: 'OpenAI Direct' }
    ]
  },
  {
    id: 'llama-3-1-405b',
    name: 'Meta Llama 3.1 405B',
    family: 'Meta',
    badge: '👑 Open Giant (405B)',
    context: '128K',
    speed: '~40 t/s',
    tags: ['general', 'reasoning', 'coding', 'free', 'flagship', 'github', 'meta'],
    desc: 'The worlds largest open-weights frontier model rivaling GPT-4 and Claude 3.5 Sonnet.',
    routes: [
      { p: 'github', m: 'Meta-Llama-3.1-405B-Instruct', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openrouter', m: 'meta-llama/llama-3.1-405b-instruct', free: false, label: 'OpenRouter' }
    ]
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2 (123B)',
    family: 'Mistral',
    badge: '🇪🇺 European Flagship',
    context: '128K',
    speed: '~75 t/s',
    tags: ['reasoning', 'coding', 'free', 'github', 'mistral'],
    desc: 'Mistrals 123B state-of-the-art multilingual and reasoning model with 80+ coding languages.',
    routes: [
      { p: 'github', m: 'Mistral-large-2407', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'mistral', m: 'mistral-large-latest', free: true, label: 'Mistral La Plateforme' },
      { p: 'openrouter', m: 'mistralai/mistral-large', free: false, label: 'OpenRouter' }
    ]
  },
  {
    id: 'codestral',
    name: 'Mistral Codestral 2501',
    family: 'Mistral',
    badge: '💻 Specialist Coding 32K',
    context: '32K',
    speed: '~105 t/s',
    tags: ['coding', 'free', 'github', 'mistral'],
    desc: 'Mistrals tailored coding model trained on 80+ programming languages with fill-in-the-middle capability.',
    routes: [
      { p: 'github', m: 'Codestral-2501', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'mistral', m: 'codestral-latest', free: true, label: 'Mistral Free Tier' }
    ]
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral Nemo 12B',
    family: 'Mistral',
    badge: '⚡ NVIDIA/Mistral Collab',
    context: '128K',
    speed: '~140 t/s',
    tags: ['fast', 'general', 'free', 'github', 'mistral'],
    desc: 'Joint 12B model by Mistral and NVIDIA with Tekken tokenizer for extreme cross-lingual efficiency.',
    routes: [
      { p: 'github', m: 'Mistral-Nemo', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openrouter', m: 'mistralai/mistral-nemo:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small 24B',
    family: 'Mistral',
    badge: '⚡ High-Efficiency Pro',
    context: '32K',
    speed: '~120 t/s',
    tags: ['fast', 'reasoning', 'free', 'github', 'mistral'],
    desc: 'Compact powerhouse delivering top-tier performance for conversational reasoning and agents.',
    routes: [
      { p: 'github', m: 'Mistral-small', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'mistral', m: 'mistral-small-latest', free: true, label: 'Mistral La Plateforme' }
    ]
  },
  {
    id: 'command-r-plus',
    name: 'Cohere Command R+',
    family: 'Cohere',
    badge: '🔍 Enterprise RAG Titan',
    context: '128K',
    speed: '~70 t/s',
    tags: ['general', 'reasoning', 'free', 'github', 'cohere'],
    desc: 'Leading enterprise model with state-of-the-art citation-backed retrieval and tool use.',
    routes: [
      { p: 'github', m: 'Cohere-command-r-plus-08-2024', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'cohere', m: 'command-r-plus', free: true, label: 'Cohere Developer Free' }
    ]
  },
  {
    id: 'command-r',
    name: 'Cohere Command R',
    family: 'Cohere',
    badge: '⚡ Fast RAG & Tools',
    context: '128K',
    speed: '~115 t/s',
    tags: ['fast', 'general', 'free', 'github', 'cohere'],
    desc: 'High-speed retrieval and multilingual text generation optimized for enterprise pipelines.',
    routes: [
      { p: 'github', m: 'Cohere-command-r-08-2024', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'cohere', m: 'command-r', free: true, label: 'Cohere Developer Free' }
    ]
  },
  {
    id: 'phi-4',
    name: 'Microsoft Phi-4 (14B)',
    family: 'Microsoft',
    badge: '🔬 Research Math/Code',
    context: '16K',
    speed: '~130 t/s',
    tags: ['coding', 'reasoning', 'free', 'github', 'microsoft'],
    desc: 'Microsoft Researchs latest small language model matching GPT-4 on competitive math and science benchmarks.',
    routes: [
      { p: 'github', m: 'Phi-4', free: true, label: 'GitHub Models (Free Azure PAT)' }
    ]
  },
  {
    id: 'phi-3-5-mini',
    name: 'Microsoft Phi-3.5 Mini (3.8B)',
    family: 'Microsoft',
    badge: '⚡ Ultra-Compact SLM',
    context: '128K',
    speed: '~220 t/s',
    tags: ['fast', 'free', 'github', 'microsoft'],
    desc: 'Lightweight 3.8B model boasting 128K context window and surprising logical capability.',
    routes: [
      { p: 'github', m: 'Phi-3.5-mini-instruct', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'openrouter', m: 'microsoft/phi-3-mini-128k-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'phi-3-5-moe',
    name: 'Microsoft Phi-3.5 MoE',
    family: 'Microsoft',
    badge: '⚡ Mixture of Experts',
    context: '128K',
    speed: '~160 t/s',
    tags: ['fast', 'reasoning', 'free', 'github', 'microsoft'],
    desc: '16x3.8B mixture-of-experts model activating only 6.6B parameters for peak inference efficiency.',
    routes: [
      { p: 'github', m: 'Phi-3.5-MoE-instruct', free: true, label: 'GitHub Models (Free Azure PAT)' }
    ]
  },
  {
    id: 'jamba-1-5-large',
    name: 'AI21 Jamba 1.5 Large',
    family: 'AI21',
    badge: '⚡ SSM-Transformer Hybrid',
    context: '256K',
    speed: '~80 t/s',
    tags: ['general', 'free', 'github', 'ai21'],
    desc: 'Hybrid Mamba-SSM architecture delivering 256K context efficiency with transformer quality.',
    routes: [
      { p: 'github', m: 'AI21-Jamba-1.5-Large', free: true, label: 'GitHub Models (Free Azure PAT)' },
      { p: 'ai21', m: 'jamba-1.5-large', free: true, label: 'AI21 Studio' }
    ]
  },
  {
    id: 'jamba-1-5-mini',
    name: 'AI21 Jamba 1.5 Mini',
    family: 'AI21',
    badge: '⚡ 256K Fast Hybrid',
    context: '256K',
    speed: '~170 t/s',
    tags: ['fast', 'free', 'github', 'ai21'],
    desc: 'Compact Mamba hybrid model processing long documents at blazing speeds with low memory usage.',
    routes: [
      { p: 'github', m: 'AI21-Jamba-1.5-Mini', free: true, label: 'GitHub Models (Free Azure PAT)' }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. GROQ CLOUD & CEREBRAS (HYPER-SPEED LPU & CS-3 INFERENCE - 100% FREE TIER)
  // --------------------------------------------------------------------------
  {
    id: 'llama-3-3-70b',
    name: 'Meta Llama 3.3 70B',
    family: 'Meta',
    badge: '🔥 Open Frontier',
    context: '128K',
    speed: '~350 t/s',
    tags: ['general', 'reasoning', 'coding', 'fast', 'free', 'popular', 'flagship', 'groq', 'cerebras', 'meta'],
    desc: 'Matches original Llama 3.1 405B capabilities with ultra-low latency and 100% free multi-cloud access.',
    routes: [
      { p: 'groq', m: 'llama-3.3-70b-versatile', free: true, label: 'Groq Cloud (Free LPU)' },
      { p: 'cerebras', m: 'llama-3.3-70b', free: true, label: 'Cerebras (Free 1800 t/s)' },
      { p: 'github', m: 'Meta-Llama-3.3-70B-Instruct', free: true, label: 'GitHub Models (Free Azure)' },
      { p: 'openrouter', m: 'meta-llama/llama-3.3-70b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'llama-3-1-8b',
    name: 'Meta Llama 3.1 8B Instant',
    family: 'Meta',
    badge: '⚡ 2,100 t/s World Record',
    context: '128K',
    speed: '~2100 t/s',
    tags: ['fast', 'general', 'free', 'popular', 'groq', 'cerebras', 'meta'],
    desc: 'Sub-100ms time-to-first-token running on Cerebras CS-3 wafer engine and Groq LPUs.',
    routes: [
      { p: 'cerebras', m: 'llama3.1-8b', free: true, label: 'Cerebras (2,100 t/s Free)' },
      { p: 'groq', m: 'llama-3.1-8b-instant', free: true, label: 'Groq Cloud (Free)' },
      { p: 'github', m: 'Meta-Llama-3.1-8B-Instruct', free: true, label: 'GitHub Models (Free)' },
      { p: 'openrouter', m: 'meta-llama/llama-3.1-8b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'llama-3-1-70b',
    name: 'Meta Llama 3.1 70B',
    family: 'Meta',
    badge: '⚡ High Precision',
    context: '128K',
    speed: '~320 t/s',
    tags: ['reasoning', 'coding', 'free', 'github', 'groq', 'meta'],
    desc: 'Battle-tested 70B open model with broad domain understanding and structured JSON outputs.',
    routes: [
      { p: 'github', m: 'Meta-Llama-3.1-70B-Instruct', free: true, label: 'GitHub Models (Free Azure)' },
      { p: 'groq', m: 'llama-3.3-70b-versatile', free: true, label: 'Groq Cloud Fallback' }
    ]
  },
  {
    id: 'llama-3-8b',
    name: 'Meta Llama 3 8B',
    family: 'Meta',
    badge: '⚡ Ultra-Fast Base',
    context: '8K',
    speed: '~800 t/s',
    tags: ['fast', 'free', 'groq', 'meta'],
    desc: 'Original Llama 3 8B architecture with rapid output streaming.',
    routes: [
      { p: 'groq', m: 'llama3-8b-8192', free: true, label: 'Groq Cloud (Free)' },
      { p: 'openrouter', m: 'meta-llama/llama-3-8b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'llama-3-70b',
    name: 'Meta Llama 3 70B',
    family: 'Meta',
    badge: '⚡ Proven 70B',
    context: '8K',
    speed: '~300 t/s',
    tags: ['reasoning', 'free', 'groq', 'meta'],
    desc: 'Solid high-capacity 70B model with high consistency.',
    routes: [
      { p: 'groq', m: 'llama3-70b-8192', free: true, label: 'Groq Cloud (Free)' }
    ]
  },
  {
    id: 'llama-3-2-3b',
    name: 'Meta Llama 3.2 3B',
    family: 'Meta',
    badge: '⚡ Ultra-Compact Edge',
    context: '128K',
    speed: '~450 t/s',
    tags: ['fast', 'free', 'openrouter', 'meta'],
    desc: 'Lightweight edge model fine-tuned for summarization, rewriting, and real-time agents.',
    routes: [
      { p: 'openrouter', m: 'meta-llama/llama-3.2-3b-instruct:free', free: true, label: 'OpenRouter Free' },
      { p: 'groq', m: 'llama-3.1-8b-instant', free: true, label: 'Groq Cloud Instant Fallback' }
    ]
  },
  {
    id: 'llama-3-2-1b',
    name: 'Meta Llama 3.2 1B',
    family: 'Meta',
    badge: '⚡ Sub-50ms Micro',
    context: '128K',
    speed: '~600 t/s',
    tags: ['fast', 'free', 'openrouter', 'meta'],
    desc: 'Ultra-small 1B parameter model delivering instant replies on resource-constrained workflows.',
    routes: [
      { p: 'openrouter', m: 'meta-llama/llama-3.2-1b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'deepseek-r1-groq',
    name: 'DeepSeek R1 Distill Llama 70B',
    family: 'DeepSeek',
    badge: '🧠 300 t/s CoT Reasoning',
    context: '128K',
    speed: '~310 t/s',
    tags: ['reasoning', 'coding', 'free', 'popular', 'groq', 'deepseek'],
    desc: 'DeepSeek R1 reasoning methodology distilled into Llama 70B, accelerated by Groq LPUs.',
    routes: [
      { p: 'groq', m: 'deepseek-r1-distill-llama-70b', free: true, label: 'Groq Cloud (Free LPU)' },
      { p: 'openrouter', m: 'deepseek/deepseek-r1-distill-llama-70b:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'deepseek-r1-qwen-32b-groq',
    name: 'DeepSeek R1 Distill Qwen 32B',
    family: 'DeepSeek',
    badge: '🧠 Code & Math Reasoning',
    context: '128K',
    speed: '~260 t/s',
    tags: ['reasoning', 'coding', 'free', 'groq', 'deepseek', 'qwen'],
    desc: 'DeepSeek R1 distilled into Qwen 2.5 32B for exceptional mathematical proofs and algorithmic code.',
    routes: [
      { p: 'groq', m: 'deepseek-r1-distill-qwen-32b', free: true, label: 'Groq Cloud (Free LPU)' }
    ]
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mistral Mixtral 8x7B MoE',
    family: 'Mistral',
    badge: '⚡ MoE Pioneer',
    context: '32K',
    speed: '~480 t/s',
    tags: ['fast', 'general', 'free', 'groq', 'mistral'],
    desc: 'Sparse mixture-of-experts model routing each token through 2 of 8 expert networks.',
    routes: [
      { p: 'groq', m: 'mixtral-8x7b-32768', free: true, label: 'Groq Cloud (Free LPU)' }
    ]
  },
  {
    id: 'llama-guard-3',
    name: 'Meta Llama Guard 3 8B',
    family: 'Meta',
    badge: '🛡️ Safety & Moderation',
    context: '8K',
    speed: '~500 t/s',
    tags: ['fast', 'free', 'groq', 'meta'],
    desc: 'Llama 3-based safeguard classifier for automated trust, safety, and content moderation.',
    routes: [
      { p: 'groq', m: 'llama-guard-3-8b', free: true, label: 'Groq Cloud (Free)' }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. DEEPSEEK & QWEN FRONTIER MODELS (OPENROUTER FREE & SILICONFLOW)
  // --------------------------------------------------------------------------
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 Full Reasoning',
    family: 'DeepSeek',
    badge: '🧠 Deep Reasoning (671B)',
    context: '128K',
    speed: '~80 t/s',
    tags: ['reasoning', 'coding', 'free', 'popular', 'flagship', 'deepseek'],
    desc: 'State-of-the-art open reasoning rivaling OpenAI o1 with transparent step-by-step thinking.',
    routes: [
      { p: 'openrouter', m: 'deepseek/deepseek-r1:free', free: true, label: 'OpenRouter Free' },
      { p: 'groq', m: 'deepseek-r1-distill-llama-70b', free: true, label: 'Groq Free Distill' },
      { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-R1', free: false, label: 'SiliconFlow' },
      { p: 'together', m: 'deepseek-ai/DeepSeek-R1', free: false, label: 'Together AI' }
    ]
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 (671B MoE)',
    family: 'DeepSeek',
    badge: '⚡ MoE Powerhouse',
    context: '64K',
    speed: '~95 t/s',
    tags: ['general', 'coding', 'free', 'popular', 'flagship', 'deepseek'],
    desc: 'Ultra-capable 671B parameter Mixture-of-Experts general intelligence model.',
    routes: [
      { p: 'openrouter', m: 'deepseek/deepseek-chat:free', free: true, label: 'OpenRouter Free' },
      { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-V3', free: false, label: 'SiliconFlow' },
      { p: 'together', m: 'deepseek-ai/DeepSeek-V3', free: false, label: 'Together AI' }
    ]
  },
  {
    id: 'qwen-2-5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    family: 'Qwen',
    badge: '💻 Specialist Coder',
    context: '128K',
    speed: '~110 t/s',
    tags: ['coding', 'free', 'popular', 'flagship', 'qwen'],
    desc: 'Ranked #1 open-source coding model in human eval and competitive software benchmarks.',
    routes: [
      { p: 'openrouter', m: 'qwen/qwen-2.5-coder-32b-instruct:free', free: true, label: 'OpenRouter Free' },
      { p: 'together', m: 'Qwen/Qwen2.5-Coder-32B-Instruct', free: false, label: 'Together AI' },
      { p: 'siliconflow', m: 'Qwen/Qwen2.5-Coder-32B-Instruct', free: false, label: 'SiliconFlow' }
    ]
  },
  {
    id: 'qwen-2-5-72b',
    name: 'Qwen 2.5 72B Instruct',
    family: 'Qwen',
    badge: '🌟 Multilingual Titan',
    context: '128K',
    speed: '~85 t/s',
    tags: ['general', 'reasoning', 'coding', 'free', 'popular', 'qwen'],
    desc: 'Alibabas flagship open model with top-tier mathematics, multilingual mastery, and coding.',
    routes: [
      { p: 'openrouter', m: 'qwen/qwen-2.5-72b-instruct:free', free: true, label: 'OpenRouter Free' },
      { p: 'together', m: 'Qwen/Qwen2.5-72B-Instruct', free: false, label: 'Together AI' },
      { p: 'siliconflow', m: 'Qwen/Qwen2.5-72B-Instruct', free: false, label: 'SiliconFlow' }
    ]
  },
  {
    id: 'qwen-2-5-7b',
    name: 'Qwen 2.5 7B Instruct',
    family: 'Qwen',
    badge: '⚡ Lightweight Master',
    context: '128K',
    speed: '~220 t/s',
    tags: ['fast', 'coding', 'free', 'qwen', 'siliconflow'],
    desc: 'Highly capable 7B model surpassing earlier 70B models in coding and structured outputs.',
    routes: [
      { p: 'openrouter', m: 'qwen/qwen-2.5-7b-instruct:free', free: true, label: 'OpenRouter Free' },
      { p: 'siliconflow', m: 'Qwen/Qwen2.5-7B-Instruct', free: true, label: 'SiliconFlow Free Tier' }
    ]
  },
  {
    id: 'qwen-2-5-14b',
    name: 'Qwen 2.5 14B Instruct',
    family: 'Qwen',
    badge: '⚡ Sweet-Spot Balance',
    context: '128K',
    speed: '~160 t/s',
    tags: ['coding', 'reasoning', 'free', 'qwen', 'siliconflow'],
    desc: 'Ideal balance of high coding reasoning and fast token generation with zero cost.',
    routes: [
      { p: 'siliconflow', m: 'Qwen/Qwen2.5-14B-Instruct', free: true, label: 'SiliconFlow (Free Tier)' },
      { p: 'openrouter', m: 'qwen/qwen-2.5-coder-32b-instruct:free', free: true, label: 'OpenRouter Fallback' }
    ]
  },
  {
    id: 'qwen-2-5-coder-7b',
    name: 'Qwen 2.5 Coder 7B',
    family: 'Qwen',
    badge: '💻 Fast Code Assistant',
    context: '128K',
    speed: '~240 t/s',
    tags: ['coding', 'fast', 'free', 'qwen', 'siliconflow'],
    desc: 'Specialized 7B coding model perfect for real-time autocomplete and code explanation.',
    routes: [
      { p: 'siliconflow', m: 'Qwen/Qwen2.5-Coder-7B-Instruct', free: true, label: 'SiliconFlow (Free Tier)' },
      { p: 'openrouter', m: 'qwen/qwen-2.5-coder-32b-instruct:free', free: true, label: 'OpenRouter Fallback' }
    ]
  },
  {
    id: 'deepseek-r1-distill-qwen-7b',
    name: 'DeepSeek R1 Distill Qwen 7B',
    family: 'DeepSeek',
    badge: '🧠 Micro Reasoning',
    context: '128K',
    speed: '~220 t/s',
    tags: ['reasoning', 'fast', 'free', 'deepseek', 'siliconflow'],
    desc: 'Ultra-fast DeepSeek R1 reasoning chain distilled into Qwen 7B.',
    routes: [
      { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', free: true, label: 'SiliconFlow (Free Tier)' }
    ]
  },
  {
    id: 'deepseek-r1-distill-qwen-14b',
    name: 'DeepSeek R1 Distill Qwen 14B',
    family: 'DeepSeek',
    badge: '🧠 Mid-Scale Reasoning',
    context: '128K',
    speed: '~150 t/s',
    tags: ['reasoning', 'coding', 'free', 'deepseek', 'siliconflow'],
    desc: 'Enhanced reasoning distillation with deeper CoT traces and high mathematical accuracy.',
    routes: [
      { p: 'siliconflow', m: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B', free: true, label: 'SiliconFlow (Free Tier)' }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. NVIDIA, SPECIALIST & CREATIVE MODELS (NEMOTRON, DOLPHIN, MYTHOMAX, ETC.)
  // --------------------------------------------------------------------------
  {
    id: 'nemotron-3-ultra-550b',
    name: 'NVIDIA Nemotron 3 Ultra 550B',
    family: 'NVIDIA',
    badge: '⚡ 550B MoE Colossus',
    context: '128K',
    speed: '~65 t/s',
    tags: ['general', 'reasoning', 'free', 'popular', 'nvidia'],
    desc: 'NVIDIAs flagship 550B parameter Mixture-of-Experts model fine-tuned for enterprise alignment.',
    routes: [
      { p: 'openrouter', m: 'nvidia/nemotron-3-ultra-550b-a55b:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'nemotron-70b',
    name: 'NVIDIA Llama 3.1 Nemotron 70B',
    family: 'NVIDIA',
    badge: '👑 Arena Top Scorer',
    context: '128K',
    speed: '~80 t/s',
    tags: ['general', 'reasoning', 'coding', 'free', 'nvidia'],
    desc: 'Custom fine-tuned Llama 3.1 70B by NVIDIA that topped the LMSYS Chatbot Arena.',
    routes: [
      { p: 'openrouter', m: 'nvidia/llama-3.1-nemotron-70b-instruct:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'dolphin-3-0-r1-mistral-24b',
    name: 'Dolphin 3.0 R1 Mistral 24B',
    family: 'Cognitive',
    badge: '🧠 Uncensored Reasoning',
    context: '32K',
    speed: '~110 t/s',
    tags: ['reasoning', 'free', 'creative'],
    desc: 'Cognitive Computations uncensored R1 reasoning model fine-tuned on Mistral NeMo 24B.',
    routes: [
      { p: 'openrouter', m: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'dolphin-3-0-mistral-24b',
    name: 'Dolphin 3.0 Mistral 24B',
    family: 'Cognitive',
    badge: '⚡ Uncensored Generalist',
    context: '32K',
    speed: '~125 t/s',
    tags: ['general', 'free', 'creative'],
    desc: 'High-compliance uncensored model for unrestricted creative and analytical queries.',
    routes: [
      { p: 'openrouter', m: 'cognitivecomputations/dolphin3.0-mistral-24b:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'mythomax-l2-13b',
    name: 'MythoMax L2 13B',
    family: 'Gryphe',
    badge: '🎭 Creative Roleplay Legend',
    context: '8K',
    speed: '~160 t/s',
    tags: ['creative', 'free'],
    desc: 'Legendary merged model combining MythoLogic and Huginn for deep narrative depth.',
    routes: [
      { p: 'openrouter', m: 'gryphe/mythomax-l2-13b:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'rogue-rose-103b',
    name: 'Rogue Rose 103B',
    family: 'Sophos',
    badge: '🌹 103B Narrative Titan',
    context: '8K',
    speed: '~45 t/s',
    tags: ['creative', 'free'],
    desc: 'Massive 103B parameter storytelling and synthesis model for complex fiction.',
    routes: [
      { p: 'openrouter', m: 'sophosympatheia/rogue-rose-103b-v0.2:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'openchat-7b',
    name: 'OpenChat 3.5 (7B)',
    family: 'OpenChat',
    badge: '⚡ C-RLFT Optimized',
    context: '8K',
    speed: '~220 t/s',
    tags: ['fast', 'general', 'free'],
    desc: 'Conditioned Reinforcement Learning fine-tuned model rivaling early ChatGPT.',
    routes: [
      { p: 'openrouter', m: 'openchat/openchat-7b:free', free: true, label: 'OpenRouter Free' }
    ]
  },
  {
    id: 'glm-4-9b',
    name: 'THUDM GLM-4 9B',
    family: 'Zhipu',
    badge: '🇨🇳 Multilingual Reasoning',
    context: '128K',
    speed: '~170 t/s',
    tags: ['general', 'reasoning', 'free', 'siliconflow'],
    desc: 'Zhipu AIs bilingual open foundation model with strong tool execution.',
    routes: [
      { p: 'siliconflow', m: 'THUDM/glm-4-9b-chat', free: true, label: 'SiliconFlow (Free Tier)' }
    ]
  },
  {
    id: 'internlm-2-5-7b',
    name: 'InternLM 2.5 7B',
    family: 'Shanghai AI',
    badge: '🔬 1M Long Context SLM',
    context: '1M',
    speed: '~180 t/s',
    tags: ['reasoning', 'coding', 'free', 'siliconflow'],
    desc: 'Features a 1-million token context window and strong mathematical logic.',
    routes: [
      { p: 'siliconflow', m: 'internlm/internlm2_5-7b-chat', free: true, label: 'SiliconFlow (Free Tier)' }
    ]
  },
  {
    id: 'mistral-7b-instruct',
    name: 'Mistral 7B Instruct v0.3',
    family: 'Mistral',
    badge: '⚡ Proven 7B Classic',
    context: '32K',
    speed: '~220 t/s',
    tags: ['fast', 'free', 'mistral'],
    desc: 'The benchmark 7B open model featuring native function calling.',
    routes: [
      { p: 'openrouter', m: 'mistralai/mistral-7b-instruct:free', free: true, label: 'OpenRouter Free' },
      { p: 'together', m: 'mistralai/Mistral-7B-Instruct-v0.3', free: false, label: 'Together AI' }
    ]
  },
  {
    id: 'ministral-8b',
    name: 'Mistral Ministral 8B',
    family: 'Mistral',
    badge: '⚡ Edge Reasoning',
    context: '128K',
    speed: '~180 t/s',
    tags: ['fast', 'reasoning', 'free', 'mistral'],
    desc: 'Mistrals flagship on-device edge model for local automation.',
    routes: [
      { p: 'mistral', m: 'ministral-8b-latest', free: true, label: 'Mistral La Plateforme' }
    ]
  },
  {
    id: 'ministral-3b',
    name: 'Mistral Ministral 3B',
    family: 'Mistral',
    badge: '⚡ Sub-80ms Ultra-Compact',
    context: '128K',
    speed: '~320 t/s',
    tags: ['fast', 'free', 'mistral'],
    desc: 'Super-efficient 3B model for low-latency client applications.',
    routes: [
      { p: 'mistral', m: 'ministral-3b-latest', free: true, label: 'Mistral La Plateforme' }
    ]
  },
  {
    id: 'command-light',
    name: 'Cohere Command Light',
    family: 'Cohere',
    badge: '⚡ Fast Developer Drafts',
    context: '4K',
    speed: '~200 t/s',
    tags: ['fast', 'free', 'cohere'],
    desc: 'Lightweight Cohere generation model with low latency and free developer rate limits.',
    routes: [
      { p: 'cohere', m: 'command-light', free: true, label: 'Cohere Developer Free' }
    ]
  }
,
  {
    "id": "learnlm-1-5-pro",
    "name": "Google LearnLM 1.5 Pro",
    "family": "Google",
    "badge": "🎓 Pedagogy Specialist",
    "context": "1M",
    "speed": "~85 t/s",
    "tags": [
      "reasoning",
      "free",
      "google"
    ],
    "desc": "Specialized pedagogical research model engineered by DeepMind to teach, explain, and guide systematically.",
    "routes": [
      {
        "p": "gemini",
        "m": "learnlm-1.5-pro-experimental",
        "free": true,
        "label": "Google AI Studio Direct"
      }
    ]
  },
  {
    "id": "gemma-2-2b-it",
    "name": "Google Gemma 2 2B",
    "family": "Google",
    "badge": "⚡ Sub-50ms Nano",
    "context": "8K",
    "speed": "~420 t/s",
    "tags": [
      "fast",
      "free",
      "google"
    ],
    "desc": "Googles pocket-sized foundation model delivering high accuracy with sub-50ms latency.",
    "routes": [
      {
        "p": "gemini",
        "m": "gemma-2-2b-it",
        "free": true,
        "label": "Google AI Studio Direct"
      },
      {
        "p": "openrouter",
        "m": "google/gemma-2-9b-it:free",
        "free": true,
        "label": "OpenRouter Gemma Fallback"
      }
    ]
  },
  {
    "id": "llama-3-2-vision-11b",
    "name": "Meta Llama 3.2 11B Vision",
    "family": "Meta",
    "badge": "👁️ Open Multimodal",
    "context": "128K",
    "speed": "~140 t/s",
    "tags": [
      "general",
      "free",
      "github",
      "meta"
    ],
    "desc": "Metas open multimodal model capable of high-resolution diagram inspection and document OCR.",
    "routes": [
      {
        "p": "github",
        "m": "Llama-3.2-11B-Vision-Instruct",
        "free": true,
        "label": "GitHub Models (Free Azure PAT)"
      },
      {
        "p": "groq",
        "m": "llama-3.2-11b-vision-preview",
        "free": true,
        "label": "Groq Cloud Preview"
      }
    ]
  },
  {
    "id": "llama-3-2-vision-90b",
    "name": "Meta Llama 3.2 90B Vision",
    "family": "Meta",
    "badge": "👁️ High-Res Vision Frontier",
    "context": "128K",
    "speed": "~80 t/s",
    "tags": [
      "reasoning",
      "free",
      "github",
      "meta"
    ],
    "desc": "Metas flagship multimodal 90B model excelling at visual math, charting, and fine image details.",
    "routes": [
      {
        "p": "github",
        "m": "Llama-3.2-90B-Vision-Instruct",
        "free": true,
        "label": "GitHub Models (Free Azure PAT)"
      }
    ]
  },
  {
    "id": "starcoder-2-15b",
    "name": "BigCode StarCoder 2 (15B)",
    "family": "BigCode",
    "badge": "💻 Multi-Lang Code Titan",
    "context": "16K",
    "speed": "~130 t/s",
    "tags": [
      "coding",
      "free",
      "github"
    ],
    "desc": "Trained on 600+ programming languages by ServiceNow and Hugging Face with open weights.",
    "routes": [
      {
        "p": "github",
        "m": "StarCoder2-15b",
        "free": true,
        "label": "GitHub Models (Free Azure PAT)"
      }
    ]
  },
  {
    "id": "phi-3-medium",
    "name": "Microsoft Phi-3 Medium 128K",
    "family": "Microsoft",
    "badge": "🔬 14B High Accuracy",
    "context": "128K",
    "speed": "~110 t/s",
    "tags": [
      "reasoning",
      "coding",
      "free",
      "microsoft"
    ],
    "desc": "14B parameter Microsoft model outperforming many larger models on common reasoning benchmarks.",
    "routes": [
      {
        "p": "openrouter",
        "m": "microsoft/phi-3-medium-128k-instruct:free",
        "free": true,
        "label": "OpenRouter Free"
      },
      {
        "p": "github",
        "m": "Phi-4",
        "free": true,
        "label": "GitHub Models Phi-4 Fallback"
      }
    ]
  },
  {
    "id": "hermes-3-llama-405b",
    "name": "Nous Hermes 3 Llama 405B",
    "family": "Nous",
    "badge": "👑 405B Agentic Frontier",
    "context": "128K",
    "speed": "~40 t/s",
    "tags": [
      "reasoning",
      "coding",
      "free",
      "nous"
    ],
    "desc": "Frontier generalist model by Nous Research fine-tuned for complex multi-step tool use and agents.",
    "routes": [
      {
        "p": "openrouter",
        "m": "nousresearch/hermes-3-llama-3.1-405b:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "hermes-2-pro-llama-8b",
    "name": "Nous Hermes 2 Pro (8B)",
    "family": "Nous",
    "badge": "⚡ Structured JSON Master",
    "context": "8K",
    "speed": "~180 t/s",
    "tags": [
      "coding",
      "fast",
      "free",
      "nous"
    ],
    "desc": "Specialized for reliable function calling, structured schemas, and roleplay fidelity.",
    "routes": [
      {
        "p": "openrouter",
        "m": "nousresearch/hermes-2-pro-llama-3-8b:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "liquid-lfm-40b",
    "name": "Liquid LFM 40B MoE",
    "family": "Liquid",
    "badge": "💧 Liquid Neural Network",
    "context": "32K",
    "speed": "~90 t/s",
    "tags": [
      "general",
      "free",
      "liquid"
    ],
    "desc": "Dynamically adaptive neural architecture based on dynamical systems for high computational efficiency.",
    "routes": [
      {
        "p": "openrouter",
        "m": "liquid/lfm-40b:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "liquid-lfm-7b",
    "name": "Liquid LFM 7B",
    "family": "Liquid",
    "badge": "💧 Fast Liquid Model",
    "context": "32K",
    "speed": "~210 t/s",
    "tags": [
      "fast",
      "free",
      "liquid"
    ],
    "desc": "Compact 7B Liquid Foundation Model delivering smooth generation and low memory requirements.",
    "routes": [
      {
        "p": "openrouter",
        "m": "liquid/lfm-7b:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "zephyr-7b-beta",
    "name": "HuggingFace Zephyr 7B Beta",
    "family": "HuggingFace",
    "badge": "⚡ DPO Fine-Tuned",
    "context": "32K",
    "speed": "~190 t/s",
    "tags": [
      "general",
      "free",
      "huggingface"
    ],
    "desc": "Direct Preference Optimization tuned Mistral 7B variant known for direct, helpful answers.",
    "routes": [
      {
        "p": "openrouter",
        "m": "huggingfaceh4/zephyr-7b-beta:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "open-orca-mistral-7b",
    "name": "OpenOrca Mistral 7B",
    "family": "OpenOrca",
    "badge": "⚡ Detailed Explanations",
    "context": "8K",
    "speed": "~200 t/s",
    "tags": [
      "general",
      "free"
    ],
    "desc": "Trained on rich step-by-step GPT-4 thought trajectories for transparent reasoning.",
    "routes": [
      {
        "p": "openrouter",
        "m": "open-orca/mistral-7b-openorca:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "toppy-m-7b",
    "name": "Toppy M 7B Merge",
    "family": "Undi",
    "badge": "🎭 SOTA 7B Merge",
    "context": "8K",
    "speed": "~210 t/s",
    "tags": [
      "creative",
      "free"
    ],
    "desc": "Master merge of leading 7B models combining coding, logic, and creative prose.",
    "routes": [
      {
        "p": "openrouter",
        "m": "undi95/toppy-m-7b:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  },
  {
    "id": "qwen-2-5-math-7b",
    "name": "Qwen 2.5 Math 7B",
    "family": "Qwen",
    "badge": "📐 Math Olympiad Solver",
    "context": "4K",
    "speed": "~200 t/s",
    "tags": [
      "reasoning",
      "free",
      "qwen",
      "siliconflow"
    ],
    "desc": "Trained specifically on competitive mathematics, geometry proofs, and LaTeX equations.",
    "routes": [
      {
        "p": "siliconflow",
        "m": "Qwen/Qwen2.5-Math-7B-Instruct",
        "free": true,
        "label": "SiliconFlow (Free Tier)"
      }
    ]
  },
  {
    "id": "qwen-2-7b-chat",
    "name": "Qwen 2 7B Chat",
    "family": "Qwen",
    "badge": "⚡ Proven Chinese/Eng Chat",
    "context": "32K",
    "speed": "~220 t/s",
    "tags": [
      "general",
      "free",
      "qwen",
      "siliconflow"
    ],
    "desc": "Foundational Qwen 2 generation with strong multilingual fluency and zero API cost.",
    "routes": [
      {
        "p": "siliconflow",
        "m": "Qwen/Qwen2-7B-Instruct",
        "free": true,
        "label": "SiliconFlow (Free Tier)"
      }
    ]
  },
  {
    "id": "deepseek-r1-distill-llama-8b",
    "name": "DeepSeek R1 Distill Llama 8B",
    "family": "DeepSeek",
    "badge": "🧠 8B CoT Reasoner",
    "context": "128K",
    "speed": "~190 t/s",
    "tags": [
      "reasoning",
      "fast",
      "free",
      "deepseek",
      "huggingface"
    ],
    "desc": "High-speed DeepSeek R1 reasoning chain distilled into Meta Llama 3.1 8B.",
    "routes": [
      {
        "p": "huggingface",
        "m": "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
        "free": true,
        "label": "Hugging Face Free Inference"
      },
      {
        "p": "groq",
        "m": "deepseek-r1-distill-llama-70b",
        "free": true,
        "label": "Groq Cloud R1 Fallback"
      }
    ]
  },
  {
    "id": "whisper-large-v3",
    "name": "OpenAI Whisper Large v3 (Groq)",
    "family": "OpenAI",
    "badge": "🎙️ SOTA Audio Transcriber",
    "context": "Audio",
    "speed": "~250x Realtime",
    "tags": [
      "fast",
      "free",
      "groq",
      "openai"
    ],
    "desc": "State-of-the-art multilingual audio transcription and translation at 250x realtime on Groq LPUs.",
    "routes": [
      {
        "p": "groq",
        "m": "whisper-large-v3",
        "free": true,
        "label": "Groq Cloud (Free LPU)"
      }
    ]
  },
  {
    "id": "whisper-large-v3-turbo",
    "name": "Whisper Large v3 Turbo (Groq)",
    "family": "OpenAI",
    "badge": "🎙️ Lightning Speech API",
    "context": "Audio",
    "speed": "~400x Realtime",
    "tags": [
      "fast",
      "free",
      "groq",
      "openai"
    ],
    "desc": "Optimized Whisper checkpoint delivering near-instant transcription for voice agents.",
    "routes": [
      {
        "p": "groq",
        "m": "whisper-large-v3-turbo",
        "free": true,
        "label": "Groq Cloud (Free LPU)"
      }
    ]
  },
  {
    "id": "bge-m3-embedding",
    "name": "BAAI BGE-M3 Universal Embedding",
    "family": "BAAI",
    "badge": "🔍 Multi-Function Retrieval",
    "context": "8K",
    "speed": "~350 t/s",
    "tags": [
      "fast",
      "free",
      "siliconflow"
    ],
    "desc": "Leading embedding model supporting dense, sparse lexical, and multi-vector search in 100+ languages.",
    "routes": [
      {
        "p": "siliconflow",
        "m": "BAAI/bge-m3",
        "free": true,
        "label": "SiliconFlow (Free Tier)"
      }
    ]
  },
  {
    "id": "nemotron-51b",
    "name": "NVIDIA Nemotron 51B Ultra",
    "family": "NVIDIA",
    "badge": "⚡ High-Density MoE",
    "context": "128K",
    "speed": "~120 t/s",
    "tags": [
      "general",
      "reasoning",
      "free",
      "nvidia"
    ],
    "desc": "Compact high-density NVIDIA model with superior code completion and math reasoning.",
    "routes": [
      {
        "p": "openrouter",
        "m": "nvidia/llama-3.1-nemotron-70b-instruct:free",
        "free": true,
        "label": "OpenRouter Free"
      }
    ]
  }
];

// Fallback cascade definitions by intent category
const SYSTEM_MODELS = {
  coding: [
    { p: 'github', m: 'Claude-3.5-Sonnet' },
    { p: 'openrouter', m: 'qwen/qwen-2.5-coder-32b-instruct:free' },
    { p: 'github', m: 'Codestral-2501' },
    { p: 'groq', m: 'llama-3.3-70b-versatile' },
    { p: 'gemini', m: 'gemini-2.5-flash' },
    { p: 'openrouter', m: 'meta-llama/llama-3.3-70b-instruct:free' }
  ],
  reasoning: [
    { p: 'openrouter', m: 'deepseek/deepseek-r1:free' },
    { p: 'groq', m: 'deepseek-r1-distill-llama-70b' },
    { p: 'gemini', m: 'gemini-2.5-pro' },
    { p: 'github', m: 'o3-mini' },
    { p: 'github', m: 'o1-mini' },
    { p: 'gemini', m: 'gemini-2.0-flash-thinking-exp-01-21' },
    { p: 'openrouter', m: 'meta-llama/llama-3.3-70b-instruct:free' }
  ],
  fast: [
    { p: 'cerebras', m: 'llama3.1-8b' },
    { p: 'groq', m: 'llama-3.1-8b-instant' },
    { p: 'gemini', m: 'gemini-2.0-flash-lite' },
    { p: 'github', m: 'gpt-4o-mini' },
    { p: 'openrouter', m: 'meta-llama/llama-3.2-3b-instruct:free' }
  ],
  general: [
    { p: 'gemini', m: 'gemini-2.5-flash' },
    { p: 'groq', m: 'llama-3.3-70b-versatile' },
    { p: 'github', m: 'gpt-4o' },
    { p: 'github', m: 'Claude-3.5-Sonnet' },
    { p: 'openrouter', m: 'meta-llama/llama-3.3-70b-instruct:free' }
  ]
};

module.exports = {
  MODEL_CATALOG,
  SYSTEM_MODELS
};
