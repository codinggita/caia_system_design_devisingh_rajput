const assert = require('assert');
const { analyticsQuerySchema, voteSchema } = require('../../src/validators/commonValidator');

describe('Validator Schemas', () => {
  describe('voteSchema', () => {
    it('accepts valid vote types', () => {
      const result = voteSchema.validate({ voteType: 'up' });
      assert.equal(result.error, undefined);
    });

    it('rejects unsupported vote types', () => {
      const result = voteSchema.validate({ voteType: 'sideways' });
      assert.ok(result.error);
    });
  });

  describe('analyticsQuerySchema', () => {
    it('applies defaults when query is empty', () => {
      const { value, error } = analyticsQuerySchema.validate({});

      assert.equal(error, undefined);
      assert.equal(value.days, 30);
      assert.equal(value.limit, 10);
    });

    it('rejects excessive day range', () => {
      const { error } = analyticsQuerySchema.validate({ days: 120, limit: 5 });
      assert.ok(error);
    });
  });
});
