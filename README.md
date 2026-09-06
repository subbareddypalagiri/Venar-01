# 🧠 VENAR - The Ultimate Unified AI Gateway & Infinite Token Engine

VENAR is a production-grade, multi-provider AI Proxy Gateway that aggregates 18+ free and freemium AI model APIs into a single, highly resilient, OpenAI-compatible endpoint.

Whenever a rate limit (HTTP 429) or downtime strikes, VENAR seamlessly and silently cascades through your custom priority list, delivering uninterrupted AI inference with **zero token cost**.

---

## ⚡ Key Architecture Features

- **🚀 Real-Time SSE Streaming:** Full Server-Sent Events (`stream: true`) support for Cursor, VS Code Cline, LibreChat, and the official OpenAI Python/Node SDKs.
- **🔐 AES-256-GCM Military Encryption:** Stored API keys are encrypted on disk with random IV and authentication tags. Plaintext keys are never stored.
- **📊 Live Mission-Control Dashboard:** Real-time metrics tracking token volume, estimated dollars saved, provider health (🟢 Ready, 🟡 Cooldown), and latency.
- **⭐ Drag & Drop Custom Priority:** Rank your preferred providers (e.g. prioritize Groq 70B before Cerebras or Gemini).
- **☁️ 1-Click Vercel & Cloud Ready:** Native Serverless Function adapter (`api/index.js`) and `vercel.json` included.
- **🛡️ Master Passcode Security:** Protect your gateway against unauthorized third-party access when deployed publicly.

---

## 🌐 Supported Model Providers (18+)

| Category | Providers |
|---|---|
| **Direct Fast Inference** | Groq Cloud, Google AI Studio (Gemini), Cerebras, Cohere, Mistral AI, AI21 Labs, NVIDIA NIM |
| **Open-Source Model Hubs** | OpenRouter, Hugging Face Router, Together AI, SiliconFlow, DeepInfra, Novita AI, Fireworks AI |
| **Frontier Models** | OpenAI (GPT-4o-mini), Anthropic (Claude 3.5 Haiku), Perplexity |

---

## 🚀 Quick Start (Local)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```
Edit `.env` if you wish to customize your port, master key encryption salt, or master lock passcode.

### 3. Start Server
```bash
node server.js
```
Open your browser at: **`http://localhost:8080`**

---

## ☁️ Deploying to Vercel (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repository to GitHub or GitLab.
2. Import the project in your [Vercel Dashboard](https://vercel.com).
3. Set the following **Environment Variables** in Vercel Project Settings:
   - `VENAR_SECRET_KEY`: A secure 32+ character passphrase for AES-256 encryption.
   - `VENAR_MASTER_PASSCODE`: (Optional) Your secret password to unlock key registration.
4. Click **Deploy**! Your gateway is now globally accessible at `https://your-venar-project.vercel.app`.

---

## 💻 Connecting with Developer Tools

### 1. Cursor / VS Code (Cline / Continue)
- **Base URL:** `http://localhost:8080/v1` (or your Vercel URL `https://your-app.vercel.app/v1`)
- **API Key:** `sk-merged-xxxxxxxxxxxxxx` (Generated in your VENAR dashboard)
- **Model:** Any model name (e.g. `default`, `groq/llama-3.3-70b-versatile`, `gemini/gemini-2.0-flash`)

### 2. Python OpenAI SDK
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="sk-merged-YOUR_KEY_HERE"
)

response = client.chat.completions.create(
    model="venar-auto",
    messages=[{"role": "user", "content": "Write a python web scraper"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

---

## 🛡️ Security Note
Your private API keys are encrypted at rest using **AES-256-GCM** with a per-payload random 12-byte initialization vector and GCM authentication tag. Decryption occurs exclusively in volatile RAM during active request routing.
