const assert = require('assert');
const { auditLogQuerySchema } = require('../../src/validators/commonValidator');
const { archiveConceptsSchema } = require('../../src/validators/conceptValidator');

describe('Operations Validators', () => {
  it('accepts valid audit log query inputs', () => {
    const { error } = auditLogQuerySchema.validate({
      page: 1,
      limit: 25,
      action: 'concept.bulk_archive',
      status: 'success',
      actorId: '507f191e810c19729de860ea'
    });

    assert.equal(error, undefined);
  });

  it('rejects invalid audit log actorId', () => {
    const { error } = auditLogQuerySchema.validate({
      actorId: 'invalid-id'
    });

    assert.ok(error);
  });

  it('rejects bulk archive payload with malformed ids', () => {
    const { error } = archiveConceptsSchema.validate({
      conceptIds: ['bad-id', '507f191e810c19729de860ea']
    });

    assert.ok(error);
  });
});
