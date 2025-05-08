// handlers/settingsHandler.js
const { ipcMain, dialog, app } = require('electron');
const fs = require('fs');
const path = require('path');

function registerSettingsHandler() {
  const dbPath = path.join(app.getAppPath(), 'database', 'kasir.db');

  // Backup database
  ipcMain.handle('backup-database', async () => {
    // Tampilkan dialog simpan
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Backup Database',
      defaultPath: `kasir-backup-${new Date().toISOString().slice(0,10)}.db`,
      filters: [{ name: 'SQLite DB', extensions: ['db'] }]
    });
    if (canceled || !filePath) return null;
    // Copy file
    fs.copyFileSync(dbPath, filePath);
    return filePath;
  });

  // Restore database
  ipcMain.handle('restore-database', async () => {
    // Tampilkan dialog pilih file
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Restore Database',
      properties: ['openFile'],
      filters: [{ name: 'SQLite DB', extensions: ['db'] }]
    });
    if (canceled || filePaths.length === 0) return null;
    // Copy file
    fs.copyFileSync(filePaths[0], dbPath);
    return filePaths[0];
  });
}

module.exports = { registerSettingsHandler }
