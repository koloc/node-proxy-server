const _ = require('lodash');
const { ClientError } = require('../utils/error-types');

// @stephenhay regex (extracted from https://mathiasbynens.be/demo/url-regex)
// Chosen for simplicity and modified to only accept http(s) urls
const uriRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

exports.validateUri = (req, res, next) => {
    const url = _.get(req, 'query.url');

    if(!url) {
        throw new ClientError('URL is missing');
    }

    if (String(url).match(uriRegex)) {
        req.validUrl = url;
    } else {
        throw new ClientError('URL format invalid', 'url', url);
    }

    next();
};
