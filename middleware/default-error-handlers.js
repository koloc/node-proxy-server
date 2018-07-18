const logger = require('../components/logger');

const clientErrorHandler = (err, req, res, next) => {
    // Handle client errors or pass to the next error handler
    if (err.isClientError) {
        let errorCode = 400;
        logger.error(err.stack);
        if (err.field) {
            errorCode = 422;
        }
        res.status(errorCode).send(err.message);
    } else {
        next(err);
    }
};

const serverErrorHandler = (err, req, res) => {
    logger.error(err.message);
    res.status(500);
};

module.exports = [
    clientErrorHandler,
    serverErrorHandler,
];
