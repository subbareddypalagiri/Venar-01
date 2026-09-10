// ==============================================================================
// VENAR SPATIAL SIDECAR ENGINE: Real-Time WebGL Dashboard & Terminal Mirror
// Runs on port 3333, streams tokens via SSE, renders 3D Codebase Galaxy.
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let serverInstance = null;
let activeClients = [];
let serverPort = 3333;
let projectDir = process.cwd();

function startSidecar(port = 3333, cwd = process.cwd(), autoOpen = true) {
  if (serverInstance) {
    console.log('\n\x1b[33mSidecar is already running on http://localhost:' + serverPort + '\x1b[0m\n');
    return;
  }

  serverPort = port;
  projectDir = cwd;

  serverInstance = http.createServer((req, res) => {
    // 1. SSE Stream
    if (req.url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write('\n');
      activeClients.push(res);
      req.on('close', () => {
        activeClients = activeClients.filter(c => c !== res);
      });
      return;
    }

    // 2. Preview Content
    if (req.url.startsWith('/preview-content')) {
      const indexPath = path.join(projectDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<!DOCTYPE html><html><body style="background:#07070b;color:#94a3b8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><h3>No index.html detected yet. Build something with VENAR!</h3></body></html>');
      }
      return;
    }

    // 3. Static Files
    const cleanUrl = req.url.split('?')[0].replace(/^\//, '');
    const localFilePath = path.join(projectDir, cleanUrl);
    if (cleanUrl && fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
      const ext = path.extname(localFilePath).toLowerCase();
      const mimeMap = {
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      fs.createReadStream(localFilePath).pipe(res);
      return;
    }

    // 4. Default: Serve sidecar.html
    const sidecarHtmlPath = path.join(__dirname, 'sidecar.html');
    if (fs.existsSync(sidecarHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(sidecarHtmlPath).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h3>VENAR Sidecar HTML missing</h3>');
    }
  });

  serverInstance.listen(serverPort, () => {
    const url = 'http://localhost:' + serverPort;
    console.log('\n\x1b[1;38;2;224;108;85m★ VENAR SPATIAL SIDECAR ONLINE\x1b[0m');
    console.log('  \x1b[32m✓ Dashboard Live at: \x1b[1m' + url + '\x1b[0m');
    console.log('  \x1b[2mReal-time 3D Galaxy + Visual Diff + Terminal Mirror active.\x1b[0m\n');

    if (autoOpen) {
      const openCmd = process.platform === 'win32' ? ('start ' + url) : (process.platform === 'darwin' ? ('open ' + url) : ('xdg-open ' + url));
      exec(openCmd, () => {});
    }
  });
}

function broadcastSidecarEvent(type, payload) {
  if (activeClients.length === 0) return;
  const msg = 'data: ' + JSON.stringify({ type, payload }) + '\n\n';
  for (const client of activeClients) {
    try {
      client.write(msg);
    } catch (e) {}
  }
}

function stopSidecar() {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
    activeClients = [];
    console.log('\n\x1b[33m✓ Spatial Sidecar stopped.\x1b[0m\n');
  } else {
    console.log('\n\x1b[2mNo Sidecar server running.\x1b[0m\n');
  }
}

module.exports = {
  startSidecar,
  broadcastSidecarEvent,
  stopSidecar
};
