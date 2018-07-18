const { Router } = require('express');

const rootRouter = Router();

rootRouter.get('/', (req, res) => {
    res.send({ health: 'OK' });
});

module.exports = rootRouter;
