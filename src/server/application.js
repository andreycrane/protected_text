'use strict';

const express = require('express');
const Keyv = require('keyv');
const bodyParser = require('body-parser');

module.exports = config => {
  const app = express();
  const db = new Keyv(...config.connectionParams);

  app.use(bodyParser.json());

  app.get('/id/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = await db.get(id);

      if (!data) {
        res.json([null, { id, data: null }]);
        return;
      }

      res.json([null, { id, data }]);
    } catch (error) {
      res.json([error, null]);
    }
  });

  app.post('/id/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req;

      await db.set(id, body);

      res.json([null, { id, data: body }]);
    } catch (error) {
      res.json([error, null]);
    }
  });

  app.delete('/id/:id', async (req, res) => {
    try {
      const { id } = req.params;

      await db.delete(id);

      res.json([null, { id, data: null }]);
    } catch (error) {
      res.json([error, null]);
    }
  });

  return { app, db };
};
