const express = require('express');
require('express-async-errors');

const router = require('./routes');

const app = express();

app.use(express.json());
app.use(router);

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).json({ error: 'Internal server error' });
})
app.listen(3000, () => console.log('Server is running on http://localhost:3000'))
