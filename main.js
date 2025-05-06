// ─ main.js ──────────────────────────────
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

// import handler
const { registerAuthHandler }      = require('./handlers/authHandler');
const { registerDashboardHandler } = require('./handlers/dashboardHandler');
const { registerProductHandler }   = require('./handlers/productHandler');

function createWindow() {
  const win = new BrowserWindow({
    width:1000, height:800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  if (isDev) win.loadURL('http://localhost:5173');
  else       win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(() => {
  createWindow();
  registerAuthHandler();
  registerDashboardHandler();
  registerProductHandler();
});
