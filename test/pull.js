process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const mockery = require('mockery');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const nock = require('nock');

chai.use(chaiHttp);
const { expect } = chai;

const redisStub = {
    getAsync: sinon.stub(),
    set: sinon.stub(),
};

mockery.registerMock('../components/redis', redisStub);

mockery.enable({
    useCleanCache: true,
    warnOnUnregistered: false,
});

const app = require('../main');

const extUrl = 'http://test.com';
const testUrl = `/test/pull?url=${extUrl}`;

const cachedContent = JSON.stringify({
    status: 200,
    body: 'cached',
    headers: {
        'X-Custom': 'custom',
    },
});

const webContent = {
    status: 200,
    body: 'not cached',
    headers: {
        'X-Custom': 'custom',
    },
};

describe('Pull a url', () => {
    beforeEach(() => {
        nock(extUrl)
            .get('/')
            .delay(500)
            .reply(webContent.status, webContent.body, webContent.headers);
    });

    it('should return the document fetched from the web when not in redis cache', (done) => {
        // Setup responses
        redisStub.getAsync = sinon.stub().rejects();

        chai.request(app)
            .get(testUrl)
            .then((res) => {
                expect(res).to.have.header('X-Cache', 'false');
            })
            .then(done);
    });

    it('should return the document from cache if present', (done) => {
        // Setup responses
        redisStub.getAsync = sinon.stub().resolves(cachedContent);

        chai.request(app)
            .get(testUrl)
            .then((res) => {
                expect(res).to.have.header('X-Cache', 'true');
            })
            .then(done);
    });
});
