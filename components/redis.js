const { promisifyAll } = require('bluebird');
const redis = promisifyAll(require('redis'));

const config = require('../config');

// Connect to redis
const redisClient = redis.createClient(config.redis.url);

module.exports = redisClient;
