const assert = require('assert');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.ENABLE_REQUEST_LOGGING = 'false';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const app = require('../../src/app');

describe('App API', () => {
  describe('GET /api/v1/health', () => {
    it('returns service health payload', async () => {
      const res = await request(app).get('/api/v1/health');

      assert.ok([200, 503].includes(res.status));
      assert.equal(res.body.success, true);
      assert.equal(typeof res.body.data.database.state, 'string');
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('rejects invalid registration payload', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({});

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.message, 'Validation failed');
      assert.ok(Array.isArray(res.body.errors));
    });
  });

  describe('POST /api/v1/auth/verify-email', () => {
    it('rejects old verify payload format', async () => {
      const res = await request(app).post('/api/v1/auth/verify-email').send({ token: 'legacy-token' });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  describe('GET /unknown', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown');

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });
});
