'use strict';

const path = require('path');
const express = require('express');
const Keyv = require('keyv');
const bodyParser = require('body-parser');
const fallback = require('express-history-api-fallback');
const morgan = require('morgan');

const router = require('./router');

module.exports.prodApp = (config = {}) => {
  const dbConnParams = config.dbConnParams || [{ store: new Map() }];
  const logger = config.logger || morgan('tiny');

  const app = express();
  const db = new Keyv(...dbConnParams);

  app.set('db', db);
  app.use(logger);
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

  app.use(router);

  const root = path.join(process.cwd(), 'dist');

  app.use(express.static(root));
  app.use(fallback('index.html', { root }));

  return { app, db };
};

module.exports.webpackApp = (config = {}) => {
  const dbConnParams = config.dbConnParams || [{ store: new Map() }];
  const logger = config.logger || morgan('tiny');

  const app = express();
  const db = new Keyv(...dbConnParams);

  app.set('db', db);
  app.use(logger);
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

  app.use(router);

  return { app, db };
};
