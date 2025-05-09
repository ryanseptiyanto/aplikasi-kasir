const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

const { registerAuthHandler }         = require('./handlers/authHandler');
const { registerDashboardHandler }    = require('./handlers/dashboardHandler');
const { registerProductHandler }      = require('./handlers/productHandler');
const { registerTransactionHandler }  = require('./handlers/transactionHandler');
const { registerMemberHandler }       = require('./handlers/memberHandler');
const { registerReportHandler }       = require('./handlers/reportHandler');
const { registerSettingsHandler }     = require('./handlers/settingsHandler');
const { registerPurchaseHandler }     = require('./handlers/purchaseHandler');
const { registerReturnHandler }      = require('./handlers/returnHandler');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  registerAuthHandler();
  registerDashboardHandler();
  registerProductHandler();
  registerTransactionHandler();
  registerMemberHandler();  
  registerReportHandler();
  registerSettingsHandler();  
  registerPurchaseHandler();
  registerReturnHandler(); 
});