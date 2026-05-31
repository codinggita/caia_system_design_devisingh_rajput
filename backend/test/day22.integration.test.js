const { expect } = require('chai');

describe('Day 22 Integration Tests', () => {
  describe('Profile Validator', () => {
    const { validateProfile } = require('../src/validators/profileValidator');

    it('should accept a valid profile payload', (done) => {
      const req = { body: { displayName: 'Learner', skills: ['node', 'mongodb'] } };
      const res = {};
      const next = () => {
        expect(req.validated).to.exist;
        expect(req.validated.displayName).to.equal('Learner');
        done();
      };

      validateProfile(req, res, next);
    });

    it('should reject invalid avatar URL', (done) => {
      const req = { body: { avatarUrl: 'not-a-url' } };
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
      validateProfile(req, res, () => {});
    });
  });

  describe('Learning Path Controller', () => {
    it('should export getLearningPath function', () => {
      const { getLearningPath } = require('../src/controllers/learningPathController');
      expect(getLearningPath).to.be.a('function');
    });
  });
});
