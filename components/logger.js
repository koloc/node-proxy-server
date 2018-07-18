const winston = require('winston');
const config = require('../config');

const logger = winston.createLogger({
    exitOnError: true,
    level: config.logLevel,
    format: winston.format.json(),
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
    ],
});

if (config.env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
    }));
}

module.exports = logger;
