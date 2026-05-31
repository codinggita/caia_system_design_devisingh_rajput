const assert = require('assert');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.ENABLE_REQUEST_LOGGING = 'false';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const app = require('../../src/app');

describe('Domain Routes', () => {
  describe('Concept routes', () => {
    it('rejects concept create without auth token', async () => {
      const payload = {
        prompt: 'Explain CAP theorem in distributed systems.',
        response: 'CAP theorem says a distributed system cannot guarantee consistency, availability and partition tolerance together.',
        metadata: {
          category: 'system-design',
          subcategory: 'distributed-systems',
          concept: 'CAP theorem'
        }
      };

      const res = await request(app).post('/api/v1/concepts').send(payload);

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });

    it('rejects invalid concept id in params', async () => {
      const res = await request(app).get('/api/v1/concepts/not-an-object-id');

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.message, 'Validation failed');
    });
  });

  describe('Discovery routes', () => {
    it('requires search query parameter', async () => {
      const res = await request(app).get('/api/v1/search');

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.message, 'Validation failed');
    });

    it('rejects invalid filter difficulty value', async () => {
      const res = await request(app).get('/api/v1/filter?difficulty=expert');

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  describe('Personal routes', () => {
    it('rejects bookmark access without auth token', async () => {
      const res = await request(app).get('/api/v1/me/bookmarks');

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });
  });
});
