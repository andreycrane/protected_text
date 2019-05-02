'use strict';

const express = require('express');

const app = express();

app.get('/id/:id', async (req, res) => {});
app.post('/id/:id', async (req, res) => {});
app.delete('/id/:id', async (req, res) => {});

module.exports = app;
