const express = require('express');
const app = express();
const routes = require('./app/routes'); 
const hostname = '127.0.0.1';
const port = 3000;

app.use(routes);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});