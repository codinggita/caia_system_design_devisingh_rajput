const { expect } = require('chai');

describe('Day 25 Integration Tests', () => {
  describe('Notification Validator', () => {
    const { validateNotification } = require('../src/validators/notificationValidator');

    it('should accept valid notification payload', (done) => {
      const req = { body: { title: 'Welcome', message: 'Thanks for joining', channel: 'in-app' } };
      const res = {};
      const next = () => {
        expect(req.validated).to.exist;
        expect(req.validated.title).to.equal('Welcome');
        done();
      };
      validateNotification(req, res, next);
    });

    it('should reject missing message', (done) => {
      const req = { body: { title: 'Bad' } };
      const res = {
        status(code) { this.statusCode = code; return this; },
        json(payload) { expect(this.statusCode).to.equal(400); expect(payload.success).to.be.false; done(); }
      };
      validateNotification(req, res, () => {});
    });
  });

  describe('Notification Controller exports', () => {
    it('should export getUserNotifications and createNotification', () => {
      const { getUserNotifications, createNotification } = require('../src/controllers/notificationController');
      expect(getUserNotifications).to.be.a('function');
      expect(createNotification).to.be.a('function');
    });
  });
});
