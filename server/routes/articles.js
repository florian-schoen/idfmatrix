const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/articles – Preisüberschreibungen als {sku: {name, price}} liefern
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT sku, name, price FROM articles').all();
  const result = {};
  rows.forEach(r => {
    result[r.sku] = {};
    if (r.name  !== null) result[r.sku].name  = r.name;
    if (r.price !== null) result[r.sku].price = r.price;
  });
  res.json(result);
});

// POST /api/articles – Preise speichern [{sku, name, price}]
router.post('/', (req, res) => {
  const overrides = req.body;
  if (!overrides || typeof overrides !== 'object') {
    return res.status(400).json({ error: 'Ungültige Daten' });
  }
  const upsert = db.prepare(`
    INSERT INTO articles (sku, name, price, updated_at)
    VALUES (@sku, @name, @price, datetime('now'))
    ON CONFLICT(sku) DO UPDATE SET
      name = excluded.name,
      price = excluded.price,
      updated_at = excluded.updated_at
  `);
  const saveAll = db.transaction(items => {
    for (const [sku, vals] of Object.entries(items)) {
      upsert.run({ sku, name: vals.name ?? null, price: vals.price ?? null });
    }
  });
  saveAll(overrides);
  res.json({ ok: true });
});

module.exports = router;
