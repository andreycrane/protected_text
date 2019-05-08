'use strict';

const express = require('express');
const Keyv = require('keyv');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = config => {
  const app = express();
  const db = new Keyv(...config.connectionParams);

  app.use(morgan('combined'));
  app.use(bodyParser.json({
    limit: '5kb',
  }));
  app.use((error, req, res, next) => {
    // Catch bodyParser error
    if (error) {
      res.json([error, null]);
      return;
    }

    next();
  });

  app.get('/api/id/:id', async (req, res) => {
    try {
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

  app.post('/api/id/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { encrypted } = req.body;

      await db.set(id, encrypted);

      res.json([null, { id, encrypted }]);
    } catch (error) {
      res.json([error, null]);
    }
  });

  app.delete('/api/id/:id', async (req, res) => {
    try {
      const { id } = req.params;

      await db.delete(id);

      res.json([null, { id, encrypted: null }]);
    } catch (error) {
      res.json([error, null]);
    }
  });

  return { app, db };
};
