// ─ backend/db.js
const Database = require('better-sqlite3');
const db = new Database('database/kasir.db');

// ── Tabel Users ──
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin','kasir')) NOT NULL DEFAULT 'kasir'
  )
`).run();

// ── Tabel Products ──
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    barcode TEXT UNIQUE,
    price REAL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0
  )
`).run();

// Tabel penampung satuan & harga per produk
db.prepare(`
  CREATE TABLE IF NOT EXISTS product_units (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id   INTEGER NOT NULL,
    unit_name    TEXT    NOT NULL,             -- nama satuan, e.g. pcs, renteng, dus
    quantity     INTEGER NOT NULL,             -- konversi ke satuan dasar (pcs)
    price_regular REAL   NOT NULL,             -- harga eceran
    price_member  REAL   NOT NULL,             -- harga member
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )
`).run();

// Tabel Transaksi
db.prepare(`
  CREATE TABLE IF NOT EXISTS transaksi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faktur TEXT UNIQUE,
    tanggal TEXT,
    total REAL,
    kasir_id INTEGER,
    FOREIGN KEY (kasir_id) REFERENCES users(id)
  )
`).run();

// Tabel Detail Transaksi
db.prepare(`
  CREATE TABLE IF NOT EXISTS transaksi_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaksi_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    price REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (transaksi_id) REFERENCES transaksi(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (unit_id) REFERENCES product_units(id)
  )
`).run();

module.exports = db;
