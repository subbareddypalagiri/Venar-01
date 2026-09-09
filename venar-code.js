#!/usr/bin/env node
// ==============================================================================
// VENAR-CODE: Autonomous Local CLI Project Generator (Claude Code Style)
// Builds complete websites & applications directly on local hard drive
// with automatic multi-model fallback across Claude 3.5, Qwen Coder, DeepSeek & Gemini.
// ==============================================================================

const readline = require('readline');
const path = require('path');
const { generateProject, listProjects } = require('./agent-engine');

// ANSI Color codes for clean terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m"
};

function banner() {
  console.log(`
${colors.cyan}${colors.bright}╔═══════════════════════════════════════════════════════════════╗
║   🧠 VENAR-CODE : Autonomous Local Project & Web Generator    ║
║   100% Free Multi-Model Fallback • Zero Rate-Limit Crashes    ║
╚═══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

async function runGenerator(prompt, projectName, techStack = 'html-tailwind') {
  console.log(`${colors.bright}🎯 Project Goal:${colors.reset} ${prompt}`);
  console.log(`${colors.bright}📁 Target Slug:${colors.reset} ${projectName || 'auto-generated'}`);
  console.log(`${colors.bright}🛠️ Tech Stack:${colors.reset}  ${techStack}\n`);

  const startTime = Date.now();

  try {
    const result = await generateProject({
      prompt,
      projectName,
      techStack,
      onProgress: (evt) => {
        switch (evt.type) {
          case 'init':
            console.log(`${colors.blue}⚡ [Workspace]${colors.reset} ${evt.message}`);
            break;
          case 'planning_start':
            console.log(`${colors.yellow}🧠 [Architecture]${colors.reset} ${evt.message}`);
            break;
          case 'plan_ready':
            console.log(`${colors.green}📋 [Plan Ready]${colors.reset} ${evt.message}`);
            if (evt.plan && evt.plan.files) {
              evt.plan.files.forEach((f, i) => {
                console.log(`   ${colors.dim}${i + 1}.${colors.reset} ${colors.bright}${f.path}${colors.reset} - ${colors.dim}${f.purpose}${colors.reset}`);
              });
            }
            console.log();
            break;
          case 'file_start':
            process.stdout.write(`${colors.cyan}⚙️  [Synthesizing]${colors.reset} Writing ${evt.file}... `);
            break;
          case 'file_done':
            process.stdout.write(`${colors.green}✓ Done${colors.reset} (${evt.lines} lines, ${(evt.bytes / 1024).toFixed(1)} KB via ${evt.provider}/${evt.model})\n`);
            break;
          case 'file_error':
            console.log(`\n${colors.red}⚠  [File Error]${colors.reset} ${evt.message}`);
            break;
          case 'complete':
            console.log(`\n${colors.green}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
            console.log(`${colors.green}${colors.bright}🎉 Project successfully generated in ${( (Date.now() - startTime) / 1000 ).toFixed(1)}s!${colors.reset}`);
            console.log(`📁 Files Location: ${colors.cyan}${evt.result.projectDir}${colors.reset}`);
            if (evt.result.previewUrl) {
              console.log(`🌐 Local Preview:  ${colors.bright}http://localhost:8080${evt.result.previewUrl}${colors.reset}`);
            }
            console.log(`${colors.green}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
            break;
        }
      }
    });

    return result;
  } catch (err) {
    console.error(`\n${colors.red}❌ Build Failed:${colors.reset} ${err.message}`);
    console.log(`${colors.dim}Tip: Make sure the VENAR gateway server is running on port 8080 (npm start)${colors.reset}\n`);
  }
}

async function interactiveCLI() {
  banner();

  const args = process.argv.slice(2);
  let promptArg = "";
  let nameArg = "";
  let stackArg = "html-tailwind";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' || args[i] === '-n') {
      nameArg = args[++i];
    } else if (args[i] === '--stack' || args[i] === '-s') {
      stackArg = args[++i];
    } else if (!promptArg && !args[i].startsWith('-')) {
      promptArg = args[i];
    }
  }

  if (promptArg) {
    await runGenerator(promptArg, nameArg, stackArg);
    process.exit(0);
  }

  // Interactive readline prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`${colors.bright}What website or app would you like to build?${colors.reset}\n> `, (prompt) => {
    if (!prompt.trim()) {
      console.log(`${colors.yellow}No prompt provided. Exiting.${colors.reset}`);
      rl.close();
      return;
    }

    rl.question(`\n${colors.bright}Project name / folder slug (or press Enter for auto):${colors.reset}\n> `, async (slug) => {
      rl.close();
      await runGenerator(prompt.trim(), slug.trim() || undefined, stackArg);
      process.exit(0);
    });
  });
}

if (require.main === module) {
  interactiveCLI();
}
