const path = require('path');
const express = require('express');
const fallback = require('express-history-api-fallback');
const createApp = require('./application');

const { app } = createApp({
  connectionParams: [
    {
      store: new Map(),
    },
  ],
});

const PORT = process.env.PORT || 5000;
const root = path.join(process.cwd(), 'dist');

app.use(express.static(root));
app.use(fallback('index.html', { root }));

app.listen(
  PORT,
  () => console.log(`Example app listening on port ${PORT}!`),
);
