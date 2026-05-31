const assert = require('assert');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.ENABLE_REQUEST_LOGGING = 'false';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.ENABLE_SYSTEM_ROUTES = 'true';

const app = require('../../src/app');

describe('Operations Routes', () => {
  it('returns pong from system ping endpoint', async () => {
    const res = await request(app).get('/api/v1/system/ping');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'pong');
  });

  it('returns readiness status with expected shape', async () => {
    const res = await request(app).get('/api/v1/system/readiness');

    assert.ok([200, 503].includes(res.status));
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.data.database.state, 'string');
  });

  it('rejects system info without admin auth token', async () => {
    const res = await request(app).get('/api/v1/system/info');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects audit logs endpoint without admin auth token', async () => {
    const res = await request(app).get('/api/v1/admin/audit-logs');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects bulk concept create without admin auth token', async () => {
    const res = await request(app).post('/api/v1/bulk/concepts').send({
      concepts: []
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects bulk concept archive without admin auth token', async () => {
    const res = await request(app).patch('/api/v1/bulk/concepts/archive').send({
      conceptIds: ['507f191e810c19729de860ea']
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });
});
