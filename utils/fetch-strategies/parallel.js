const Promise = require('bluebird');

class ParallelFetch {
    constructor(requests, options = {}) {
        this.requests = requests;
        this.options = options;
    }

    fetch() {
        return Promise.any(this.requests.map(r => r.call(null, this.options)));
    }
}

module.exports = ParallelFetch;
