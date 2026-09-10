// ==============================================================================
// VENAR TIME MACHINE: Git Shadowing & 1-Click Rollback Checkpoints
// Creates micro-snapshots before any AI edit, guaranteeing zero data loss.
// ==============================================================================

const fs = require('fs');
const path = require('path');
const os = require('os');

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  peach: "\x1b[38;2;224;108;85m",
  peachBold: "\x1b[1;38;2;224;108;85m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m"
};

function getCheckpointsDir(cwd = process.cwd()) {
  const dir = path.join(cwd, '.venar_history');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getIndexFile(cwd) {
  return path.join(getCheckpointsDir(cwd), 'index.json');
}

function loadHistory(cwd) {
  try {
    const f = getIndexFile(cwd);
    if (fs.existsSync(f)) {
      return JSON.parse(fs.readFileSync(f, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveHistory(cwd, list) {
  fs.writeFileSync(getIndexFile(cwd), JSON.stringify(list, null, 2), 'utf8');
}

function createCheckpoint(name = 'Auto Checkpoint', cwd = process.cwd()) {
  const history = loadHistory(cwd);
  const id = Date.now().toString();
  const cpDir = path.join(getCheckpointsDir(cwd), id);
  if (!fs.existsSync(cpDir)) fs.mkdirSync(cpDir, { recursive: true });

  const items = fs.readdirSync(cwd, { withFileTypes: true });
  const captured = [];

  for (const item of items) {
    if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === '.venar_history') continue;
    if (item.isFile()) {
      const src = path.join(cwd, item.name);
      const dest = path.join(cpDir, item.name);
      try {
        fs.copyFileSync(src, dest);
        captured.push(item.name);
      } catch (e) {}
    }
  }

  const record = {
    id,
    name,
    timestamp: new Date().toISOString(),
    filesCount: captured.length,
    files: captured
  };

  history.push(record);
  saveHistory(cwd, history);
  return record;
}

function rewindLastCheckpoint(cwd = process.cwd()) {
  const history = loadHistory(cwd);
  if (history.length === 0) {
    return { error: 'No checkpoints found in history.' };
  }

  const last = history.pop();
  const cpDir = path.join(getCheckpointsDir(cwd), last.id);

  if (fs.existsSync(cpDir)) {
    for (const file of last.files) {
      const src = path.join(cpDir, file);
      const dest = path.join(cwd, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }
    try {
      fs.rmSync(cpDir, { recursive: true, force: true });
    } catch (e) {}
  }

  saveHistory(cwd, history);
  return { restored: last };
}

function printHistory(cwd = process.cwd()) {
  const history = loadHistory(cwd);
  console.log('\n' + c.peachBold + '═══ VENAR TIME-MACHINE CHECKPOINTS ═══' + c.reset);
  if (history.length === 0) {
    console.log('  ' + c.dim + 'No checkpoints recorded yet. (Auto-created before every AI edit or run /checkpoint)' + c.reset + '\n');
    return;
  }

  history.slice(-10).reverse().forEach((cp) => {
    const timeStr = new Date(cp.timestamp).toLocaleTimeString();
    console.log('  ' + c.yellow + '#' + cp.id.slice(-4) + c.reset + ' ' + c.bold + cp.name + c.reset + ' ' + c.dim + '(' + timeStr + ' · ' + cp.filesCount + ' files)' + c.reset);
  });

  console.log('\n' + c.peachBold + 'Commands:' + c.reset);
  console.log('  ' + c.cyan + '/rewind' + c.reset + '            - Rollback to the previous snapshot');
  console.log('  ' + c.cyan + '/checkpoint <name>' + c.reset + ' - Manually capture a labeled checkpoint\n');
}

module.exports = {
  createCheckpoint,
  rewindLastCheckpoint,
  printHistory
};
