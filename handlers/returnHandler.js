// handlers/returnHandler.js
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerReturnHandler() {
  // Create a return (header + details)
  ipcMain.handle('create-return', (event, { transaksi_id, kasir_id, items }) => {
    // Generate return code: "RT" + YYMMDD + 5-digit sequence
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );
    const yy = String(now.getFullYear() % 100).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const prefix = `RT${yy}${mm}${dd}`;
    const { cnt } = db.prepare(
      'SELECT COUNT(*) AS cnt FROM returns WHERE return_code LIKE ?'
    ).get(`${prefix}%`);
    const seq = String(cnt + 1).padStart(5, '0');
    const return_code = prefix + seq;
    const tanggal = now.toISOString().slice(0, 19).replace('T', ' ');

    const total_refund = items.reduce((sum, i) => sum + i.subtotal, 0);

    // Insert return header
    const headerStmt = db.prepare(
      'INSERT INTO returns (return_code, tanggal, transaksi_id, total_refund, kasir_id) VALUES (?, ?, ?, ?, ?)'
    );
    const info = headerStmt.run(return_code, tanggal, transaksi_id, total_refund, kasir_id);
    const returnId = info.lastInsertRowid;

    // Insert return details and adjust stock
    const detailStmt = db.prepare(
      `INSERT INTO return_details (return_id, product_id, unit_id, qty, price, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const adjustStmt = db.prepare(
      'UPDATE products SET stock = stock + ? WHERE id = ?'
    );

    const trx = db.transaction((details) => {
      for (const d of details) {
        detailStmt.run(returnId, d.product_id, d.unit_id, d.qty, d.price, d.subtotal);
        adjustStmt.run(d.qty, d.product_id);
      }
    });
    trx(items);

    return { return_code, tanggal, total_refund };
  });

  // Fetch all returns
  ipcMain.handle('fetch-returns', () => {
    return db.prepare(`
      SELECT r.id, r.return_code, r.tanggal, r.total_refund, u.username AS kasir
      FROM returns r
      JOIN users u ON u.id = r.kasir_id
      ORDER BY r.tanggal DESC
    `).all();
  });

  // Fetch return details
  ipcMain.handle('fetch-return-details', (event, returnId) => {
    return db.prepare(`
      SELECT rd.product_id, p.name, rd.qty, rd.price, rd.subtotal
      FROM return_details rd
      JOIN products p ON p.id = rd.product_id
      WHERE rd.return_id = ?
    `).all(returnId);
  });
}

module.exports = { registerReturnHandler };