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
