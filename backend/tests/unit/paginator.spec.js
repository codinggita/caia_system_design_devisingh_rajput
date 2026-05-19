const assert = require('assert');
const { buildPaginationMeta, resolvePagination } = require('../../src/utils/paginator');

describe('Paginator Utility', () => {
  it('resolves sane defaults for missing input', () => {
    const result = resolvePagination({});

    assert.equal(result.page, 1);
    assert.equal(result.limit, 10);
    assert.equal(result.skip, 0);
  });

  it('clamps limit to maxLimit and computes skip correctly', () => {
    const result = resolvePagination({
      page: 3,
      limit: 500,
      maxLimit: 100
    });

    assert.equal(result.page, 3);
    assert.equal(result.limit, 100);
    assert.equal(result.skip, 200);
  });

  it('creates pagination metadata from totals', () => {
    const meta = buildPaginationMeta({
      page: 2,
      limit: 20,
      total: 45
    });

    assert.deepEqual(meta, {
      page: 2,
      limit: 20,
      total: 45,
      totalPages: 3
    });
  });
});
