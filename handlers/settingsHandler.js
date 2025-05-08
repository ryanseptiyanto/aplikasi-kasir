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

  // Fetch all settings as key-value pairs
  ipcMain.handle('fetch-settings', () => {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    return rows.reduce((obj, { key, value }) => {
      obj[key] = value;
      return obj;
    }, {});
  });

  // Update or insert a setting
  ipcMain.handle('update-setting', (event, { key, value }) => {
    const exists = db.prepare('SELECT 1 FROM settings WHERE key = ?').get(key);
    if (exists) {
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(value, key);
    } else {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, value);
    }
    return { key, value };
  });
}

module.exports = { registerSettingsHandler }
