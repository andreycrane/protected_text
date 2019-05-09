const express = require('express');

const router = express.Router();

router.get('/api/id/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;

    const encrypted = await db.get(id);

    if (!encrypted) {
      res.json([null, { id, encrypted: null }]);
      return;
    }

    res.json([null, { id, encrypted }]);
  } catch (error) {
    res.json([error, null]);
  }
});

router.post('/api/id/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    const { encrypted } = req.body;

    await db.set(id, encrypted);

    res.json([null, { id, encrypted }]);
  } catch (error) {
    res.json([error, null]);
  }
});

router.delete('/api/id/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;

    await db.delete(id);

    res.json([null, { id, encrypted: null }]);
  } catch (error) {
    res.json([error, null]);
  }
});

module.exports = router;
