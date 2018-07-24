const Promise = require('bluebird');
const _ = require('lodash');

class ParallelFetch {
    constructor(requests, options = {}) {
        if (!_.isArray(requests) || _.isEmpty(requests)) {
            throw new Error('You must provide a series of requests to execute.');
        }
        this.requests = requests;
        this.options = options;
    }

    fetch() {
        return Promise.any(this.requests.map(r => r.call(null, this.options)));
    }
}

module.exports = ParallelFetch;
