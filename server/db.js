const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'idfmatrix.db');

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    sku  TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;
