// handlers/productHandler.js
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerProductHandler() {
  ipcMain.handle('fetch-products', () => {
    return db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  });

  ipcMain.handle('create-product', (e, p) => {
    const info = db.prepare(`
      INSERT INTO products (name, barcode, price, stock, min_stock)
      VALUES (@name, @barcode, @price, @stock, @min_stock)
    `).run(p);
    return { id: info.lastInsertRowid, ...p };
  });

  ipcMain.handle('update-product', (e, p) => {
    db.prepare(`
      UPDATE products SET
        name      = @name,
        barcode   = @barcode,
        price     = @price,
        stock     = @stock,
        min_stock = @min_stock
      WHERE id = @id
    `).run(p);
    return p;
  });

  ipcMain.handle('delete-product', (e, id) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return { success: true, id };
  });
}

module.exports = { registerProductHandler };
