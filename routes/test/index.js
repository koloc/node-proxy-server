const { Router } = require('express');
const pullController = require('./pull');

const testRouter = Router();

testRouter.use('/pull', pullController);

module.exports = testRouter;
