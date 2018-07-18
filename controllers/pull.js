const axios = require('axios');
const redisClient = require('../components/redis');
const { cacheExpiration } = require('../config');
const { addCacheHeaders } = require('../utils/cache');

const logger = require('../components/logger');

// Change the following path to change the fetch strategy.
// This can be, in a future iteration, configured somewhere or
// dynamically set, based on stats or monitoring, for example.
const FetchStrategy = require('../utils/fetch-strategies/parallel');

const fetchFromCache = ({ url }) => redisClient.getAsync(url).then((res) => {
    if (res !== null) {
        const response = JSON.parse(res);
        return {
            fromCache: true,
            url,
            status: response.status,
            body: response.body,
            headers: addCacheHeaders(response.headers, cacheExpiration, true),
        };
    }
    throw new Error('Not in cache');
});

// TODO: handle cancellation
const fetchFromWeb = ({ url }) => axios.get(url)
    .then(res => ({
        fromCache: false,
        url,
        status: res.status,
        body: res.data,
        headers: addCacheHeaders(res.headers, cacheExpiration, false),
    }));


exports.fetch = function get(req, res) {
    // Get the cached page data from Redis Cache.
    // 3. Handle 3 conditions:
    // 1. Cache doesn’t exist, fetch the data from the URL specified in the input
    // 2. Cache exist, return the data to client, at the same time, handle
    //    the condition of cache expired.
    //     1. Cache exists but expired, fetch the data again from up stream URL.
    //     2. Save the URL into cache with TTL 5 minutes.

    function respondToClient(result) {
        logger.debug(JSON.stringify(result.headers));
        res
            .set(result.headers)
            .status(result.status)
            .send(result.body);
        return result;
    }

    function saveToRedis(result) {
        if (!result.fromCache) {
            const {
                url,
                status,
                data,
                headers,
            } = result;
            const saveStr = JSON.stringify({ status, data, headers });

            // Save and set expiration time
            redisClient.set(url, saveStr, 'EX', cacheExpiration);
        }
        return result;
    }

    function cancelPendingRequests(result) {
        // TODO: implement cancelling the pending requests
        return result;
    }

    const fetchStrategy = new FetchStrategy([
        fetchFromCache,
        fetchFromWeb,
    ], { url: req.validUrl });

    fetchStrategy.fetch()
        .then(respondToClient)
        .then(cancelPendingRequests)
        .then(saveToRedis)
        .catch((err) => {
            throw new Error(err.message);
        });
};
