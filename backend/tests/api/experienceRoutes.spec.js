const assert = require('assert');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.ENABLE_REQUEST_LOGGING = 'false';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.ENABLE_SYSTEM_ROUTES = 'true';

const app = require('../../src/app');

describe('Experience Routes', () => {
  it('rejects invalid discovery query options', async () => {
    const res = await request(app).get('/api/v1/discovery/trending?limit=1000&days=120');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Validation failed');
  });

  it('rejects personalized discovery without auth token', async () => {
    const res = await request(app).get('/api/v1/discovery/recommended?limit=5');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects my notes endpoint without auth token', async () => {
    const res = await request(app).get('/api/v1/me/notes?sort=newest');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects activity endpoint without auth token', async () => {
    const res = await request(app).get('/api/v1/me/activity');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('preserves incoming x-request-id in headers and response payload', async () => {
    const incomingId = 'caia-test-request-id';
    const res = await request(app).get('/api/v1/system/ping').set('x-request-id', incomingId);

    assert.equal(res.status, 200);
    assert.equal(res.headers['x-request-id'], incomingId);
    assert.equal(res.body.requestId, incomingId);
  });
});
