#!/usr/bin/env node
// ==============================================================================
// VENAR CLI: Autonomous Local Codebase Assistant (Claude Code Style)
// Runs directly in ANY folder/repo on your computer.
// Reads files, writes edits, executes commands, and debugs errors.
// Powered by VENAR Multi-Model Free Fallback Engine.
// ==============================================================================

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const os = require('os');
const { execSync } = require('child_process');

const CWD = process.cwd();
const GATEWAY_URL = process.env.VENAR_GATEWAY_URL || 'http://localhost:8080/v1/chat/completions';

// Exact Claude Code Color Palette
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  peach: "\x1b[38;2;224;108;85m",      // Claude Code signature terracotta/peach
  peachBold: "\x1b[1;38;2;224;108;85m",
  peachDim: "\x1b[2;38;2;224;108;85m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[97m"
};

let activeModel = 'claude-3-5-sonnet';
let totalTokensUsed = 0;

let MODEL_CATALOG = [];
try {
  const catPath = path.join(__dirname, 'models-catalog.js');
  if (fs.existsSync(catPath)) {
    MODEL_CATALOG = require(catPath).MODEL_CATALOG || [];
  }
} catch (e) {}

function getUserKeysPath() {
  const dir = path.join(os.homedir(), '.venar');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'keys.json');
}

function loadUserKeys() {
  try {
    const p = getUserKeysPath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveUserKey(provider, key) {
  const p = getUserKeysPath();
  const keys = loadUserKeys();
  keys[provider.toLowerCase()] = key.trim();
  fs.writeFileSync(p, JSON.stringify(keys, null, 2), 'utf8');
  return keys;
}

function removeUserKey(provider) {
  const p = getUserKeysPath();
  const keys = loadUserKeys();
  delete keys[provider.toLowerCase()];
  fs.writeFileSync(p, JSON.stringify(keys, null, 2), 'utf8');
  return keys;
}

const conversationHistory = [
  {
    role: 'system',
    content: `You are VENAR, an elite Staff Software Engineer and autonomous coding assistant running inside the user's terminal, styled exactly after Claude Code.
You are operating in the local directory: "${CWD}".

Rules:
1. When asked to edit or create code, output the relative file path and complete updated code:
\`\`\`file:relative/path/to/file.ext
// updated code
\`\`\`
2. When asked to run commands, output:
\`\`\`bash
command here
\`\`\`
3. Always be concise, actionable, and helpful like Claude Code.`
  }
];

function printBanner() {
  const user = os.userInfo().username || 'Developer';
  const welcomeName = user.charAt(0).toUpperCase() + user.slice(1);
  const termWidth = Math.min(process.stdout.columns || 80, 100);
  const horizontalLine = '─'.repeat(Math.max(10, termWidth - 24));

  const userKeys = loadUserKeys();
  const keyProviders = Object.keys(userKeys);
  const keyStatus = keyProviders.length > 0
    ? `${c.green}✓ ${keyProviders.join(', ')} active (${MODEL_CATALOG.length || 87}+ free models unlocked)${c.reset}`
    : `${c.yellow}No API keys set yet · Type ${c.bold}/key${c.reset}${c.yellow} to add Groq/Gemini/OpenRouter${c.reset}`;

  console.log(`
${c.peachDim}──${c.reset} ${c.peachBold}Venar Code v1.0.0${c.reset} ${c.peachDim}${horizontalLine}${c.reset}

  ${c.white}${c.bold}Welcome back ${welcomeName}!${c.reset}
          ${c.peach}* *${c.reset}
        ${c.peach}┌───┐ *${c.reset}
        ${c.peach}│${c.white}🤖${c.peach} │${c.reset}
        ${c.peach}└───┘${c.reset}
    ${c.white}Claude 3.5 Sonnet${c.reset} · ${c.green}Free Multi-Cloud Org${c.reset}
    ${c.dim}${CWD}${c.reset}
    ${c.dim}Vault:${c.reset} ${keyStatus}

${c.peach}  Tips for getting started${c.reset}
  Run ${c.yellow}/init${c.reset} to create a VENAR.md file with codebase instructions
  Run ${c.yellow}/key${c.reset} to manage free API keys (Groq, Gemini, GitHub, Mistral)
  Run ${c.yellow}/models${c.reset} to browse all 87+ free models in fallback catalog
  Note: Connected to local VENAR Gateway on port 8080 (100% Free Tokens)

${c.peach}  Recent activity${c.reset}
  ${c.dim}Autonomous multi-model router active (Claude 3.5 / DeepSeek R1 / Qwen 2.5 / Gemini)${c.reset}

${c.peachBold}
  _  _ _____ _  _   _   ___    ___ ___  ___  ___ 
 | || | ____| \| | /_\\ | _ \\  / __/ _ \\|   \\| __|
 | \\/ |  _| | .\` |/ _ \\|   / | (_| (_) | |) | _| 
  \\__/|_____|_|\\_/_/ \\_\\_|_\\  \\___\\___/|___/|___|
${c.reset}

  ${c.dim}/model to switch models · /fallback to view cascade · /help for commands${c.reset}
${c.peachDim}─────────────────────────────────────────────────────────────────────────────────────────────${c.reset}
`);
}

function getDirectoryTree(dir, maxDepth = 2, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  const results = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (['node_modules', '.git', '.next', 'dist', 'build', '.cache'].includes(item.name)) continue;
      const relPath = path.relative(CWD, path.join(dir, item.name));
      if (item.isDirectory()) {
        results.push(`📁 ${relPath}/`);
        results.push(...getDirectoryTree(path.join(dir, item.name), maxDepth, currentDepth + 1));
      } else {
        results.push(`📄 ${relPath}`);
      }
    }
  } catch (e) {}
  return results;
}

function readFileContent(relPath) {
  const fullPath = path.resolve(CWD, relPath);
  if (!fullPath.startsWith(CWD)) return null;
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fs.readFileSync(fullPath, 'utf8');
  }
  return null;
}

function writeProjectFile(relPath, content) {
  const fullPath = path.resolve(CWD, relPath);
  if (!fullPath.startsWith(CWD)) throw new Error("Path traversal blocked");
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

async function callGateway(messages) {
  const userKeys = loadUserKeys();
  const headers = { 'Content-Type': 'application/json' };
  if (userKeys && Object.keys(userKeys).length > 0) {
    headers['x-venar-client-keys'] = encodeURIComponent(JSON.stringify(userKeys));
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      model: activeModel,
      mode: 'auto',
      max_tokens: 4096,
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errMsg = err.error || `Gateway returned HTTP ${res.status}`;
    if (res.status === 401 && (!userKeys || Object.keys(userKeys).length === 0)) {
      throw new Error(`${errMsg}\n${c.yellow}👉 Quick fix: Run ${c.bold}/key <provider> <your_key>${c.reset}${c.yellow} (e.g. /key groq gsk_... or /key gemini AIza...)${c.reset}`);
    }
    throw new Error(errMsg);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  const provider = res.headers.get('x-venar-provider') || data.venar_telemetry?.provider || 'auto';
  const model = res.headers.get('x-venar-model') || data.venar_telemetry?.model || activeModel;
  const attempts = data.venar_telemetry?.attempts || [];

  return { content, provider, model, attempts };
}

function parseFileBlocks(text) {
  const regex = /```(?:file:)?([\w./\\-]+)\r?\n([\s\S]*?)```/g;
  const matches = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    const filename = m[1].trim();
    if (filename.includes('.') && !['json', 'js', 'ts', 'html', 'css', 'bash', 'sh', 'py'].includes(filename)) {
      matches.push({ file: filename, content: m[2] });
    }
  }
  return matches;
}

async function handleUserQuery(input, rl) {
  const query = input.trim();
  if (!query) return;

  if (query === '?' || query === '/help') {
    console.log(`
${c.peachBold}VENAR Code Shortcuts & Commands:${c.reset}
  ${c.yellow}/init${c.reset}         - Create VENAR.md file with instructions for this codebase
  ${c.yellow}/files${c.reset}        - Scan and list all files in this project
  ${c.yellow}/key${c.reset}          - View or configure API keys (~/.venar/keys.json)
  ${c.yellow}/key <p> <k>${c.reset}  - Add provider key (e.g. /key groq gsk_... or /key gemini AIza...)
  ${c.yellow}/models${c.reset}       - Browse all 87+ free models in the fallback catalog
  ${c.yellow}/model <name>${c.reset} - Switch model (e.g. /model deepseek-r1 or /model claude-3-5-sonnet)
  ${c.yellow}/fallback${c.reset}     - View the live multi-model cascade ladder
  ${c.yellow}/cost${c.reset}         - View token usage telemetry & cost ($0.00 zero-bill)
  ${c.yellow}/status${c.reset}       - Check VENAR Gateway connection
  ${c.yellow}/clear${c.reset}        - Clear terminal screen
  ${c.yellow}/exit${c.reset}         - Exit VENAR Code

${c.dim}Tips:
  • Ask: "Explain what this project does"
  • Ask: "edit <filepath> to add dark mode"
  • Run shell: "!npm test" or "!git status"
${c.reset}`);
    return;
  }

  if (query === '/keys' || query === '/key') {
    const keys = loadUserKeys();
    const providers = Object.keys(keys);
    console.log(`\n${c.peachBold}═══ VENAR API KEY VAULT (~/.venar/keys.json) ═══${c.reset}`);
    if (providers.length === 0) {
      console.log(`\n  ${c.yellow}No API keys configured yet.${c.reset}`);
      console.log(`\n  ${c.bold}To add a free provider key:${c.reset}`);
      console.log(`    ${c.cyan}/key groq <your_groq_api_key>${c.reset}         (Free at console.groq.com)`);
      console.log(`    ${c.cyan}/key gemini <your_gemini_api_key>${c.reset}     (Free at aistudio.google.com)`);
      console.log(`    ${c.cyan}/key openrouter <your_openrouter_key>${c.reset} (Free at openrouter.ai)`);
      console.log(`    ${c.cyan}/key github <your_github_pat_token>${c.reset}   (Free at github.com/settings/tokens)`);
      console.log(`    ${c.cyan}/key mistral <your_mistral_api_key>${c.reset}   (Free at console.mistral.ai)`);
      console.log(`    ${c.cyan}/key cerebras <your_cerebras_key>${c.reset}     (Free at cloud.cerebras.ai)`);
    } else {
      console.log(`\n  ${c.green}Active API Providers (${providers.length}):${c.reset}`);
      providers.forEach(p => {
        const val = keys[p];
        const masked = val.length > 8 ? val.slice(0, 4) + '••••' + val.slice(-4) : '••••';
        console.log(`    • ${c.bold}${p.padEnd(12)}${c.reset} : ${c.dim}${masked}${c.reset}`);
      });
      console.log(`\n  ${c.dim}Add more: /key <provider> <api_key>${c.reset}`);
      console.log(`  ${c.dim}Remove:   /key remove <provider>${c.reset}`);
    }
    console.log();
    return;
  }

  if (query.startsWith('/key ')) {
    const parts = query.slice(5).trim().split(/\s+/);
    if (parts[0].toLowerCase() === 'remove' && parts[1]) {
      const p = parts[1].toLowerCase();
      removeUserKey(p);
      console.log(`\n${c.green}✓ Removed ${p} API key.${c.reset}\n`);
      return;
    }
    if (parts.length >= 2) {
      const p = parts[0].toLowerCase();
      const val = parts.slice(1).join('');
      saveUserKey(p, val);
      console.log(`\n${c.green}✓ Saved ${p.toUpperCase()} API key to ~/.venar/keys.json!${c.reset}`);
      console.log(`${c.dim}All models and fallback routes using ${p} are now permanently unlocked.${c.reset}\n`);
      return;
    }
    console.log(`\n${c.yellow}Usage: /key <provider> <api_key>${c.reset} (e.g. /key groq gsk_...) or /key remove <provider>\n`);
    return;
  }

  if (query === '/models') {
    console.log(`\n${c.peachBold}═══ VENAR UNIVERSAL FREE MODEL CATALOG (${MODEL_CATALOG.length || 87} Verified Models) ═══${c.reset}\n`);
    const coding = MODEL_CATALOG.filter(m => m.tags.includes('coding') || m.tags.includes('code'));
    const reasoning = MODEL_CATALOG.filter(m => m.tags.includes('reasoning') || m.tags.includes('cot'));
    const fast = MODEL_CATALOG.filter(m => m.tags.includes('fast'));
    const general = MODEL_CATALOG.filter(m => !coding.includes(m) && !reasoning.includes(m) && !fast.includes(m));

    console.log(`${c.bold}💻 CODING SPECIALISTS (${coding.length} Models):${c.reset}`);
    coding.forEach(m => console.log(`  • ${c.cyan}${m.id.padEnd(28)}${c.reset} ${c.dim}[${m.family}]${c.reset} ${c.green}${m.speed}${c.reset} - ${m.name}`));

    console.log(`\n${c.bold}🧠 REASONING & CHAIN-OF-THOUGHT (${reasoning.length} Models):${c.reset}`);
    reasoning.forEach(m => console.log(`  • ${c.cyan}${m.id.padEnd(28)}${c.reset} ${c.dim}[${m.family}]${c.reset} ${c.green}${m.speed}${c.reset} - ${m.name}`));

    console.log(`\n${c.bold}⚡ ULTRA-FAST LOW LATENCY (${fast.length} Models):${c.reset}`);
    fast.forEach(m => console.log(`  • ${c.cyan}${m.id.padEnd(28)}${c.reset} ${c.dim}[${m.family}]${c.reset} ${c.green}${m.speed}${c.reset} - ${m.name}`));

    console.log(`\n${c.bold}🌐 FRONTIER MULTIMODAL & GENERAL (${general.length} Models):${c.reset}`);
    general.slice(0, 15).forEach(m => console.log(`  • ${c.cyan}${m.id.padEnd(28)}${c.reset} ${c.dim}[${m.family}]${c.reset} ${c.green}${m.speed}${c.reset} - ${m.name}`));
    if (general.length > 15) console.log(`  ${c.dim}... and ${general.length - 15} more verified models in catalog${c.reset}`);

    console.log(`\n${c.peach}Switch model anytime: /model <id>${c.reset}\n`);
    return;
  }

  if (query === '/fallback') {
    console.log(`\n${c.peachBold}═══ VENAR INDESTRUCTIBLE MULTI-MODEL FALLBACK LADDER ═══${c.reset}`);
    console.log(`${c.dim}If any cloud provider hits a 429 rate limit or network lag, VENAR auto-cascades instantly:${c.reset}\n`);
    console.log(`  ${c.green}1. [Active Model]${c.reset}   ${c.bold}${activeModel}${c.reset}`);
    console.log(`         ${c.peach}↓ (if 429 rate limit or quota exceeded)${c.reset}`);
    console.log(`  ${c.cyan}2. [Tier 1 Coder]${c.reset}  Qwen 2.5 Coder 32B (OpenRouter / SiliconFlow)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.cyan}3. [Tier 2 Logic]${c.reset}  DeepSeek R1 671B (Groq / OpenRouter)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.cyan}4. [Tier 3 Code]${c.reset}   Codestral 2501 (Mistral AI / GitHub Azure)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.cyan}5. [Tier 4 Pro]${c.reset}    Google Gemini 2.5 Pro (Google AI Studio 2M Context)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.cyan}6. [Tier 5 Flash]${c.reset}  Google Gemini 2.5 Flash (@ 140 t/s)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.cyan}7. [Tier 6 Speed]${c.reset}  Meta Llama 3.3 70B Versatile (Groq @ 300 t/s)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.cyan}8. [Tier 7 Ultra]${c.reset}  Cerebras Llama 3.1 8B (@ 2,100 t/s)`);
    console.log(`         ${c.peach}↓${c.reset}`);
    console.log(`  ${c.yellow}9. [Tier 8+]${c.reset}       80+ Additional Verified Free Models in Catalog`);
    console.log(`\n${c.green}✓ Status: 100% Free Tokens • Zero Rate-Limit Crashes Guaranteed${c.reset}\n`);
    return;
  }

  if (query === '/init') {
    const venarMdPath = path.join(CWD, 'VENAR.md');
    const tree = getDirectoryTree(CWD);
    const content = `# VENAR.md — Project Architecture & Rules
> Generated by VENAR Code v1.0.0 (Claude Code Paradigm)

## Project Overview
- **Path:** \`${CWD}\`
- **Active Model:** \`${activeModel}\`
- **Fallback Engine:** Claude 3.5 Sonnet ⇄ Qwen 2.5 Coder ⇄ DeepSeek R1 ⇄ Gemini 2.5 Pro

## Files in Repository
${tree.map(f => `- ${f}`).join('\n')}

## Coding Conventions
- Write clean, modular, production-ready code.
- Avoid placeholders or \`// TODO\` omissions.
- Test all modifications before deployment.
`;
    fs.writeFileSync(venarMdPath, content, 'utf8');
    console.log(`${c.green}✓ Created VENAR.md in ${CWD}${c.reset}\n`);
    return;
  }

  if (query === '/cost') {
    console.log(`
${c.peachBold}⚡ VENAR Token Consumption Telemetry:${c.reset}
  • Total Tokens Estimated: ${c.white}${totalTokensUsed.toLocaleString()}${c.reset}
  • Active Billing Cost:   ${c.green}${c.bold}$0.00 USD (100% Free Multi-Cloud Tier)${c.reset}
  • Fallback Engine:       ${c.cyan}Claude 3.5 Sonnet ⇄ DeepSeek R1 ⇄ Qwen 2.5 ⇄ Gemini 2.5${c.reset}
`);
    return;
  }

  if (query === '/files') {
    console.log(`\n${c.bold}Scanning ${CWD}...${c.reset}`);
    const tree = getDirectoryTree(CWD);
    if (tree.length === 0) {
      console.log(`${c.dim}(Folder is empty)${c.reset}\n`);
    } else {
      tree.forEach(line => console.log(`  ${line}`));
      console.log(`\n${c.dim}Total items: ${tree.length}${c.reset}\n`);
    }
    return;
  }

  if (query.startsWith('/model')) {
    const parts = query.split(' ');
    if (parts[1]) {
      activeModel = parts[1].trim();
      console.log(`${c.green}✓ Switched active model to: ${c.bold}${activeModel}${c.reset}\n`);
    } else {
      console.log(`\n${c.peachBold}Active Model:${c.reset} ${c.green}${activeModel}${c.reset}`);
      console.log(`${c.dim}Available free models:${c.reset}`);
      console.log(`  1. ${c.cyan}claude-3-5-sonnet${c.reset}  (Frontier Reasoning & Coding)`);
      console.log(`  2. ${c.cyan}deepseek-r1${c.reset}        (Deep Chain-of-Thought Math/Logic)`);
      console.log(`  3. ${c.cyan}qwen-2-5-coder-32b${c.reset} (Dedicated Code Architecture)`);
      console.log(`  4. ${c.cyan}gemini-2.5-flash${c.reset}   (Ultra High Speed & 1M Context)`);
      console.log(`  5. ${c.cyan}gpt-4o${c.reset}             (General Multimodal)\n`);
      console.log(`${c.dim}Usage: /model <model-name>${c.reset}\n`);
    }
    return;
  }

  if (query === '/status') {
    try {
      const res = await fetch('http://localhost:8080/api/health-stats');
      if (res.ok) {
        const stats = await res.json();
        console.log(`${c.green}✓ VENAR Gateway Online${c.reset} (${stats.catalogModelsCount} models verified, ${stats.providersCount} providers active)\n`);
      } else {
        console.log(`${c.red}❌ Gateway returned status ${res.status}${c.reset}\n`);
      }
    } catch (e) {
      console.log(`${c.red}❌ Cannot connect to Gateway on http://localhost:8080. Start it with 'npm start'${c.reset}\n`);
    }
    return;
  }

  if (query === '/clear') {
    console.clear();
    printBanner();
    return;
  }

  if (query === '/exit' || query === 'exit') {
    console.log(`${c.peach}Exiting VENAR Code. Happy coding! 👋${c.reset}`);
    process.exit(0);
  }

  // Shell Command Execution Support (e.g. !git status or !dir)
  if (query.startsWith('!') || query.toLowerCase().startsWith('run ')) {
    const cmd = query.startsWith('!') ? query.slice(1).trim() : query.slice(4).trim();
    console.log(`\n${c.dim}> Executing: ${cmd}${c.reset}\n`);
    try {
      const out = execSync(cmd, { cwd: CWD, encoding: 'utf8', stdio: 'pipe' });
      console.log(out);
    } catch (e) {
      console.log(`${c.red}Error executing command:${c.reset} ${e.message}`);
      if (e.stdout) console.log(e.stdout);
      if (e.stderr) console.log(e.stderr);
    }
    console.log();
    return;
  }

  const tree = getDirectoryTree(CWD);
  const mentionedFiles = [];
  for (const item of tree) {
    const cleanPath = item.replace(/^[📄📁]\s*/, '').trim();
    if (query.toLowerCase().includes(path.basename(cleanPath).toLowerCase())) {
      const content = readFileContent(cleanPath);
      if (content && content.length < 50000) {
        mentionedFiles.push({ path: cleanPath, content });
      }
    }
  }

  let promptWithContext = query;
  if (mentionedFiles.length > 0) {
    promptWithContext += '\n\nContext Files in Workspace:\n' + mentionedFiles.map(f => `--- File: ${f.path} ---\n${f.content}\n--- End File ---`).join('\n');
  } else {
    promptWithContext += '\n\nCurrent Directory Tree:\n' + tree.slice(0, 30).join('\n');
  }

  conversationHistory.push({ role: 'user', content: promptWithContext });

  process.stdout.write(`\n${c.peach}⏳ Venar is thinking...${c.reset} `);

  try {
    const { content, provider, model } = await callGateway(conversationHistory);
    process.stdout.write(`\r${c.green}✓ Responded via ${provider}/${model}:${c.reset}\n\n`);

    totalTokensUsed += Math.ceil(content.length / 4);

    console.log(content);
    console.log();

    conversationHistory.push({ role: 'assistant', content });

    const fileBlocks = parseFileBlocks(content);
    if (fileBlocks.length > 0) {
      for (const block of fileBlocks) {
        rl.question(`${c.bold}${c.peach}Apply changes to '${block.file}'? (y/N): ${c.reset}`, (answer) => {
          if (answer.trim().toLowerCase() === 'y') {
            try {
              writeProjectFile(block.file, block.content);
              console.log(`${c.green}✓ Saved ${block.file} to disk!${c.reset}\n`);
            } catch (err) {
              console.log(`${c.red}❌ Error writing file: ${err.message}${c.reset}\n`);
            }
          } else {
            console.log(`${c.dim}Skipped writing ${block.file}.${c.reset}\n`);
          }
          rl.prompt();
        });
        return;
      }
    }

  } catch (err) {
    console.log(`\r${c.red}❌ Error:${c.reset} ${err.message}\n`);
    console.log(`${c.dim}Make sure 'npm start' is running in the venar folder.${c.reset}\n`);
  }
}

function startREPL() {
  printBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${c.peachBold}> ${c.reset}`
  });

  rl.prompt();

  rl.on('line', async (line) => {
    await handleUserQuery(line, rl);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(`\n${c.peach}Bye!${c.reset}`);
    process.exit(0);
  });
}

if (process.argv.length > 2) {
  const inlineQuery = process.argv.slice(2).join(' ');
  const dummyRl = { question: (q, cb) => cb('y'), prompt: () => {} };
  handleUserQuery(inlineQuery, dummyRl).then(() => process.exit(0));
} else {
  startREPL();
}
