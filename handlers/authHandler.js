const { ipcMain } = require('electron');
const { login } = require('../backend/auth');

function registerAuthHandler() {
  ipcMain.handle('login', async (event, username, password) => {
    const result = login(username, password);
    return result; // {id, username, role} atau null
  });
}

module.exports = { registerAuthHandler };
