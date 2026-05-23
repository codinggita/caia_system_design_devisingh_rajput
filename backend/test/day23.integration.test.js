const { expect } = require('chai');

describe('Day 23 Integration Tests', () => {
  describe('Progress Validator', () => {
    const { validateProgress } = require('../src/validators/progressValidator');

    it('should accept valid progress payload', (done) => {
      const req = { body: { streakDays: 5, currentLevel: 'intermediate' } };
      const res = {};
      const next = () => {
        expect(req.validated).to.exist;
        expect(req.validated.streakDays).to.equal(5);
        done();
      };

      validateProgress(req, res, next);
    });

    it('should reject invalid completedConcepts IDs', (done) => {
      const req = { body: { completedConcepts: ['invalid-id'] } };
      const res = {
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          expect(this.statusCode).to.equal(400);
          expect(payload.success).to.be.false;
          done();
        }
      };
      validateProgress(req, res, () => {});
    });
  });

  describe('Progress Controller exports', () => {
    it('should export getUserProgress and updateUserProgress', () => {
      const { getUserProgress, updateUserProgress } = require('../src/controllers/progressController');
      expect(getUserProgress).to.be.a('function');
      expect(updateUserProgress).to.be.a('function');
    });
  });
});
