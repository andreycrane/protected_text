const createApp = require('./application');

const { app, db } = createApp({
  connectionParams: [
    {
      store: new Map(),
    },
  ],
});

const port = 3000;

app.listen(
  port,
  () => console.log(`Example app listening on port ${port}!`),
);
