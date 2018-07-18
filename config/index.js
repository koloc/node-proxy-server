const joi = require('joi');

const envSchema = joi.object({
    NODE_ENV: joi.string()
        .allow(['development', 'production', 'test'])
        .default('development'),
    PORT: joi.number()
        .port()
        .default(8080),
    REDIS_URL: joi.string()
        .uri()
        .default('redis://127.0.0.1:6379'),
    LOGLEVEL: joi.string()
        .allow(['debug', 'info', 'warn', 'error'])
        .default('error'),
    CACHE_EXPIRATION: joi.number()
        .default(300), // default to 5 min
}).required();

const { err, value: envVars } = joi.validate(process.env, envSchema);
if (err) {
    throw new Error(`Config error: ${err.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    logLevel: envVars.LOGLEVEL,
    cacheExpiration: envVars.CACHE_EXPIRATION,
    server: {
        port: envVars.PORT,
    },
    redis: {
        url: envVars.REDIS_URL,
    },
};

module.exports = config;
