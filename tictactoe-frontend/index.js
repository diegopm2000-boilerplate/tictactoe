// index.js

const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/public`));

app.listen(3010, () => {
  // eslint-disable-next-line no-console
  console.log('Web Server initialized!');
});
