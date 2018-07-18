const express = require('express');

const defaultErrorHandlers = require('./middleware/default-error-handlers');

const { rootRouter, testRouter } = require('./routes');

const app = express();

app.use('/test', testRouter);
app.use('/', rootRouter);

app.use(defaultErrorHandlers);

module.exports = app;
