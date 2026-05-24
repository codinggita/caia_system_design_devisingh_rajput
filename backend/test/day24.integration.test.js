const { expect } = require('chai');

describe('Day 24 Integration Tests', () => {
  describe('Achievement Validator', () => {
    const { validateAchievement } = require('../src/validators/achievementValidator');

    it('should accept a valid achievement payload', (done) => {
      const req = { body: { title: 'First Milestone', status: 'unlocked', score: 10 } };
      const res = {};
      const next = () => {
        expect(req.validated).to.exist;
        expect(req.validated.title).to.equal('First Milestone');
        done();
      };
      validateAchievement(req, res, next);
    });

    it('should reject invalid status values', (done) => {
      const req = { body: { title: 'Bad Achievement', status: 'completed' } };
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
      validateAchievement(req, res, () => {});
    });
  });

  describe('Achievement Controller exports', () => {
    it('should export achievement controller functions', () => {
      const { getUserAchievements, createOrUpdateAchievement } = require('../src/controllers/achievementController');
      expect(getUserAchievements).to.be.a('function');
      expect(createOrUpdateAchievement).to.be.a('function');
    });
  });
});
