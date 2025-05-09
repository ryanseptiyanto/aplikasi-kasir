// handlers/purchaseHandler.js
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerPurchaseHandler() {
  // Fetch all suppliers
  ipcMain.handle('fetch-suppliers', () => {
    return db.prepare('SELECT id, name, phone, address FROM suppliers ORDER BY name ASC').all();
  });

  // Create new supplier
  ipcMain.handle('create-supplier', (event, { name, phone, address }) => {
    const stmt = db.prepare(
      'INSERT INTO suppliers (name, phone, address) VALUES (?, ?, ?)'
    );
    const info = stmt.run(name, phone, address);
    return { id: info.lastInsertRowid, name, phone, address };
  });

  // Fetch all purchase orders (header)
  ipcMain.handle('fetch-purchase-orders', () => {
    const stmt = db.prepare(`
      SELECT po.id, po.tanggal, po.total, s.name AS supplier_name
      FROM purchase_orders po
      JOIN suppliers s ON s.id = po.supplier_id
      ORDER BY po.tanggal DESC
    `);
    return stmt.all();
  });

  // Create a new purchase order
  ipcMain.handle('create-purchase-order', (event, { supplier_id, items }) => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );
    const tanggal = now.toISOString().slice(0, 19).replace('T', ' ');
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    // Insert header
    const poStmt = db.prepare(
      'INSERT INTO purchase_orders (supplier_id, tanggal, total) VALUES (?, ?, ?)'
    );
    const info = poStmt.run(supplier_id, tanggal, total);
    const orderId = info.lastInsertRowid;

    // Insert details and adjust stock
    const detailStmt = db.prepare(
      `INSERT INTO purchase_order_details (order_id, product_id, qty, price, subtotal)
       VALUES (?, ?, ?, ?, ?)`
    );
    const adjustStmt = db.prepare(
      'UPDATE products SET stock = stock + ? WHERE id = ?'
    );

    const trx = db.transaction((details) => {
      for (const d of details) {
        detailStmt.run(orderId, d.product_id, d.qty, d.price, d.subtotal);
        adjustStmt.run(d.qty, d.product_id);
      }
    });
    trx(items);

    return { orderId, tanggal, total };
  });

  // Fetch details for a specific purchase order
  ipcMain.handle('fetch-purchase-order-details', (event, orderId) => {
    return db.prepare(`
      SELECT pod.product_id, p.name, pod.qty, pod.price, pod.subtotal
      FROM purchase_order_details pod
      JOIN products p ON p.id = pod.product_id
      WHERE pod.order_id = ?
    `).all(orderId);
  });
}

module.exports = { registerPurchaseHandler };
