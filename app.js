const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const apiRouter = require('./routes/api-router');

const { handleCustomErrors, handlePsqlErrors } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.all('/*', (req, res, next) =>
  res.status(404).send({ msg: 'Route not found' })
);

module.exports = app;
