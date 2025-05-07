// handlers/memberHandler.js
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerMemberHandler() {
  // Fetch all members
  ipcMain.handle('fetch-members', () => {
    return db.prepare('SELECT * FROM members ORDER BY id DESC').all();
  });

  // Create new member
  ipcMain.handle('create-member', (event, member) => {
    const stmt = db.prepare(`
      INSERT INTO members (code, name, phone, created)
      VALUES (@code, @name, @phone, @created)
    `);
    stmt.run(member);
    // Return created member data
    return member;
  });

  // Update existing member
  ipcMain.handle('update-member', (event, member) => {
    const stmt = db.prepare(`
      UPDATE members SET
        code  = @code,
        name  = @name,
        phone = @phone
      WHERE id = @id
    `);
    stmt.run(member);
    return member;
  });

  // Delete member
  ipcMain.handle('delete-member', (event, id) => {
    const stmt = db.prepare('DELETE FROM members WHERE id = ?');
    stmt.run(id);
    return { success: true, id };
  });
}

module.exports = { registerMemberHandler };
