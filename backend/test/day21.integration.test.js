const { expect } = require('chai');

describe('Day 21 Integration Tests', () => {
  describe('Preferences Validator', () => {
    const { validatePreferences } = require('../src/validators/preferencesValidator');

    it('should accept a valid preferences payload', (done) => {
      const req = { body: { preferences: { theme: 'dark' }, interests: ['node', 'express'] } };
      const res = {};
      const next = () => {
        expect(req.validated).to.exist;
        expect(req.validated.interests).to.include('node');
        done();
      };
      validatePreferences(req, res, next);
    });

    it('should reject invalid preferences types', (done) => {
      const req = { body: { interests: 'not-an-array' } };
      const res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(payload) {
          expect(payload.success).to.be.false;
          expect(this.statusCode).to.equal(400);
          done();
        }
      };
      const next = () => {};
      validatePreferences(req, res, next);
    });
  });

  describe('Recommendation Controller (basic smoke)', () => {
    it('should export getRecommendations function', () => {
      const { getRecommendations } = require('../src/controllers/recommendationController');
      expect(getRecommendations).to.be.a('function');
    });
  });
});
