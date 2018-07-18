const { Router } = require('express');
const pullController = require('../../controllers/pull');
const { validateUri } = require('../../middleware/uri-utils');

const pullRouter = Router();

pullRouter.get('/', validateUri, pullController.fetch);

module.exports = pullRouter;
