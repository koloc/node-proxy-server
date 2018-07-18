const _ = require('lodash');

class SerializedFetch {
    constructor(requests, options = {}) {
        if (!_.isArray(requests) || _.isEmpty(requests)) {
            throw new Error('You must provide a series of requests to execute.');
        }
        this.requests = requests;
        this.options = options;
    }

    fetch() {
        let promise = this.requests[0].call(null, this.options);
        for (let i = 1, len = this.requests.length; i < len; i += 1) {
            promise = promise.catch(() => this.requests[i].call(null, this.options));
        }
        return promise;
    }
}

module.exports = SerializedFetch;
