// handlers/productHandler.js
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerProductHandler() {
  // hapus handler lama jika sudah ada
  ipcMain.removeHandler('fetch-products');
  ipcMain.removeHandler('create-product');
  ipcMain.removeHandler('update-product');
  ipcMain.removeHandler('delete-product');

  // daftar ulang handler
  ipcMain.handle('fetch-products',    ()           => db.prepare('SELECT * FROM products ORDER BY id DESC').all());
  ipcMain.handle('create-product',    (e, {product, units}) => {
    const info = db.prepare(`
      INSERT INTO products (name, barcode, price, stock, min_stock)
      VALUES (@name, @barcode, @price, @stock, @min_stock)
    `).run(product);
    const pid = info.lastInsertRowid;

    const insertUnit = db.prepare(`
      INSERT INTO product_units
        (product_id, unit_name, quantity, price_regular, price_member)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction(arr => {
      for (const u of arr) insertUnit.run(pid, u.unit_name, u.quantity, u.price_regular, u.price_member);
    });
    insertMany(units);

    return { id: pid, ...product };
  });
  ipcMain.handle('update-product',    (e, {product, units}) => {
    db.prepare(`
      UPDATE products SET
        name       = @name,
        barcode    = @barcode,
        price      = @price,
        stock      = @stock,
        min_stock  = @min_stock
      WHERE id = @id
    `).run(product);

    db.prepare('DELETE FROM product_units WHERE product_id = ?').run(product.id);
    const insertUnit = db.prepare(`
      INSERT INTO product_units
        (product_id, unit_name, quantity, price_regular, price_member)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction(arr => {
      for (const u of arr) insertUnit.run(product.id, u.unit_name, u.quantity, u.price_regular, u.price_member);
    });
    insertMany(units);

    return product;
  });
  ipcMain.handle('delete-product',    (e, id)     => {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return { success: true, id };
  });
}

module.exports = { registerProductHandler };
