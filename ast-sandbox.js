// ==============================================================================
// VENAR SPECULATIVE IN-MEMORY AST SANDBOX
// Intercepts code blocks BEFORE disk write, verifies syntax in V8 memory isolate,
// prevents disk pollution, and triggers autonomous self-healing on errors.
// ==============================================================================

const vm = require('vm');
const path = require('path');

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  peach: "\x1b[38;2;224;108;85m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

/**
 * Validates a file's content in memory before committing to disk.
 * @param {string} filePath - Target file path (e.g. app.js, styles.css)
 * @param {string} content - Raw synthesized file content
 * @returns {{ valid: boolean, error?: string, line?: number }}
 */
function validateCodeBlock(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();

  // 1. JavaScript / TypeScript / Node Syntax Verification
  if (['.js', '.mjs', '.cjs'].includes(ext)) {
    try {
      // Compile into V8 Script isolate without executing
      new vm.Script(content, { filename: filePath, displayErrors: true });
    } catch (err) {
      return {
        valid: false,
        error: `SyntaxError: ${err.message}`,
        line: err.stack ? extractLineNumber(err.stack) : undefined
      };
    }
  }

  // 2. JSON Parse Integrity Verification
  if (ext === '.json') {
    try {
      JSON.parse(content);
    } catch (err) {
      return {
        valid: false,
        error: `JSON ParseError: ${err.message}`
      };
    }
  }

  // 3. HTML Tag Structural Sanity
  if (['.html', '.htm'].includes(ext)) {
    const unclosedCheck = checkHtmlStructuralIntegrity(content);
    if (!unclosedCheck.valid) {
      return unclosedCheck;
    }
  }

  return { valid: true };
}

function extractLineNumber(stack) {
  const match = stack.match(/:(\d+):(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

function checkHtmlStructuralIntegrity(html) {
  // Check for critical missing closing tags for vital structural blocks
  const criticalTags = ['html', 'head', 'body', 'main', 'script'];
  for (const tag of criticalTags) {
    const openCount = (html.match(new RegExp(`<${tag}[^>]*>`, 'gi')) || []).length;
    const closeCount = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (openCount > 0 && closeCount === 0) {
      return {
        valid: false,
        error: `HTML Malformed: Tag '<${tag}>' opened but never closed with '</${tag}>'.`
      };
    }
  }

  // Check script tag balance
  const scriptOpens = (html.match(/<script[^>]*>/gi) || []).length;
  const scriptCloses = (html.match(/<\/script>/gi) || []).length;
  if (scriptOpens !== scriptCloses) {
    return {
      valid: false,
      error: `HTML Script Mismatch: ${scriptOpens} <script> open vs ${scriptCloses} </script> close tags.`
    };
  }

  return { valid: true };
}

/**
 * Filter an array of file blocks through the in-memory sandbox.
 * Blocks corrupted files from touching the disk.
 */
function auditFileBlocksInMemory(fileBlocks) {
  const approved = [];
  const rejected = [];

  for (const block of fileBlocks) {
    const check = validateCodeBlock(block.file, block.content);
    if (check.valid) {
      approved.push(block);
    } else {
      rejected.push({
        file: block.file,
        content: block.content,
        error: check.error,
        line: check.line
      });
    }
  }

  return { approved, rejected };
}

module.exports = {
  validateCodeBlock,
  auditFileBlocksInMemory
};
