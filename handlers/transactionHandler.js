const { ipcMain } = require('electron');
const db = require('../backend/db');
const { v4: uuidv4 } = require('uuid');

function registerTransactionHandler() {
  // Create Transaction (header + details)
  ipcMain.handle('create-transaction', (event, { kasir_id, items, bayar }) => {
    const faktur = uuidv4();
    const tanggal = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    // simpan header transaksi
    const info = db.prepare(`
      INSERT INTO transaksi (faktur, tanggal, total, kasir_id)
      VALUES (?, ?, ?, ?)
    `).run(faktur, tanggal, total, kasir_id);
    const tx_id = info.lastInsertRowid;

    // simpan detail
    const insertDetail = db.prepare(`
      INSERT INTO transaksi_detail
        (transaksi_id, product_id, unit_id, qty, price, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((arr) => {
      for (const it of arr) {
        insertDetail.run(tx_id, it.product_id, it.unit_id, it.qty, it.price, it.subtotal);
      }
    });
    insertMany(items);

    return { faktur, total, bayar, kembalian: bayar - total };
  });

  // Fetch all transactions for report
  ipcMain.handle('fetch-transactions', () => {
    return db.prepare(`
      SELECT t.id, t.faktur, t.tanggal, t.total, u.username AS kasir
      FROM transaksi t
      LEFT JOIN users u ON u.id = t.kasir_id
      ORDER BY t.tanggal DESC
    `).all();
  });

  // Get details for a given faktur
  ipcMain.handle('get-transaction-detail', (event, faktur) => {
    return db.prepare(`
      SELECT td.id, td.qty, td.price, td.subtotal,
             p.name, pu.unit_name
      FROM transaksi_detail td
      JOIN transaksi t ON t.id = td.transaksi_id
      JOIN products p ON p.id = td.product_id
      JOIN product_units pu ON pu.id = td.unit_id
      WHERE t.faktur = ?
    `).all(faktur);
  });
}

module.exports = { registerTransactionHandler };