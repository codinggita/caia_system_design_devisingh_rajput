const assert = require('assert');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.ENABLE_REQUEST_LOGGING = 'false';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const app = require('../../src/app');

describe('Governance Routes', () => {
  it('rejects vote submission without auth token', async () => {
    const res = await request(app)
      .post('/api/v1/votes/507f191e810c19729de860ea')
      .send({ voteType: 'up' });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects admin dashboard access without auth token', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  it('rejects analytics access without auth token', async () => {
    const res = await request(app).get('/api/v1/analytics/top-concepts');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });
});
