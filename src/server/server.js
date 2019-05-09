const { prodApp } = require('./application');

const port = process.env.PORT || 5000;
const { app } = prodApp();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
