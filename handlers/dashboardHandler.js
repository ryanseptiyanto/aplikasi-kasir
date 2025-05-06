// ─ handlers/dashboardHandler.js ─────────────────
const { ipcMain } = require('electron');
const db = require('../backend/db');

function registerDashboardHandler() {
  ipcMain.handle('fetch-dashboard', () => {
    // Hitung total produk
    const productCount = db
      .prepare('SELECT COUNT(*) AS cnt FROM products')
      .get().cnt;

    // Hitung produk stok ≤ min_stock
    const lowStockCount = db
      .prepare('SELECT COUNT(*) AS cnt FROM products WHERE stock <= min_stock')
      .get().cnt;

    // Hitung jumlah transaksi hari ini (by tanggal)
    const today = new Date().toISOString().slice(0,10);
    const todaySalesCount = db
      .prepare(`SELECT COUNT(*) AS cnt FROM transaksi WHERE tanggal = ?`)
      .get(today).cnt;

    return { productCount, lowStockCount, todaySalesCount };
  });
}

module.exports = { registerDashboardHandler };
