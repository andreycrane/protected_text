'use strict';

const express = require('express');
const Keyv = require('keyv');
const bodyParser = require('body-parser');

module.exports = config => {
  const app = express();
  const db = new Keyv(...config.connectionParams);

  app.use(bodyParser.json());

  app.get('/id/:id', async (req, res) => {
    const { id } = req.params;
    const data = await db.get(id);

    if (!data) {
      res.json({ id, data: null });
      return;
    }

    res.json({ id, data });
  });

  app.post('/id/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    await db.set(id, body);

    res.json({ id, data: body });
  });

  app.delete('/id/:id', async (req, res) => {
    const { id } = req.params;

    await db.delete(id);

    res.json({ id, data: null });
  });

  return { app, db };
};
