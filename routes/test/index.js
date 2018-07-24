const { Router } = require('express');
const pullRouter = require('./pull');

const testRouter = Router();

testRouter.use('/pull', pullRouter);

module.exports = testRouter;
