// ─ backend/db.js ──────────────────────────────
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

// backend/db.js
// … existing code …

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

// ── Tabel Transaksi ──
db.prepare(`
  CREATE TABLE IF NOT EXISTS transaksi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faktur TEXT,
    tanggal TEXT,
    total REAL
  )
`).run();

module.exports = db;
