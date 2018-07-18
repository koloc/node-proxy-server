const _ = require('lodash');

exports.addCacheHeaders = (headers, seconds = 300, fromCache = false) => {
    const newHeaders = _.chain(headers)
        .mapKeys((v, h) => h.toLowerCase())
        .omit(['expires', 'pragma', 'cache-control'])
        .assign({
            'Cache-Control': `public, max-age=${seconds}`,
            'X-Cache': fromCache,
        })
        .value();

    return newHeaders;
};
