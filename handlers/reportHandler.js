// handlers/reportHandler.js
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerReportHandler() {
  // Sales report harian: total penjualan per hari dalam rentang tanggal
  ipcMain.handle('fetch-sales-report', (event, { from, to }) => {
    // from, to dalam format 'YYYY-MM-DD'
    const stmt = db.prepare(`
      SELECT
        substr(tanggal, 1, 10) AS tanggal,
        COUNT(*) AS transaksi_count,
        SUM(total) AS omzet_harian
      FROM transaksi
      WHERE date(tanggal) BETWEEN date(?) AND date(?)
      GROUP BY tanggal
      ORDER BY tanggal ASC
    `);
    return stmt.all(from, to);
  });

  // Product report: produk terlaris berdasarkan total qty terjual
  ipcMain.handle('fetch-product-report', () => {
    return db.prepare(`
      SELECT
        td.product_id,
        p.name,
        SUM(td.qty) AS total_qty
      FROM transaksi_detail td
      JOIN products p ON p.id = td.product_id
      GROUP BY td.product_id
      ORDER BY total_qty DESC
    `).all();
  });
}

module.exports = { registerReportHandler };
