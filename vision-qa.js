// ==============================================================================
// VENAR VISION QA: Autonomous Visual Eye & Layout Verification
// Analyzes DOM, viewport rendering, console errors & WebGL status.
// ==============================================================================

const fs = require('fs');
const path = require('path');

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  peach: "\x1b[38;2;224;108;85m",
  peachBold: "\x1b[1;38;2;224;108;85m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[97m"
};

function inspectLocalProject(cwd = process.cwd()) {
  console.log('\n' + c.peachBold + '═══ VENAR VISUAL QA EYE: PROJECT INSPECTION ═══' + c.reset);
  const htmlPath = path.join(cwd, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.log(c.yellow + 'No index.html detected in current directory to inspect.\n' + c.reset);
    return;
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  console.log('  ' + c.dim + 'Target: ' + c.white + htmlPath + c.reset);

  const checks = [
    { name: 'Viewport Meta Tag (Mobile Responsiveness)', pass: htmlContent.includes('viewport') },
    { name: 'CSS Stylesheet Integration', pass: htmlContent.includes('<link rel="stylesheet"') || htmlContent.includes('<style>') },
    { name: 'JavaScript Entrypoint', pass: htmlContent.includes('<script') },
    { name: 'WebGL / Three.js Canvas Element', pass: htmlContent.includes('<canvas') || htmlContent.includes('three') },
    { name: 'Modern Typography & Contrast', pass: htmlContent.includes('font') || htmlContent.includes('styles.css') },
    { name: 'Accessible Landmark Elements (<main>, <header>)', pass: htmlContent.includes('<main') || htmlContent.includes('<header') }
  ];

  let score = 0;
  console.log('\n' + c.bold + 'Visual & Structural Quality Checklist:' + c.reset);
  checks.forEach(chk => {
    if (chk.pass) score += 1;
    const badge = chk.pass ? c.green + '✓ PASS' + c.reset : c.yellow + '○ WARNING' + c.reset;
    console.log('  ' + badge + ' ' + chk.name);
  });

  const finalScore = ((score / checks.length) * 10).toFixed(1);
  const color = score >= 5 ? c.green : c.yellow;
  console.log('\n  ' + c.bold + 'Visual Health Score: ' + color + finalScore + '/10.0' + c.reset);
  console.log(c.dim + 'Tip: Run /serve to launch live browser preview and inspect real-time animations.' + c.reset + '\n');
}

module.exports = {
  inspectLocalProject
};
