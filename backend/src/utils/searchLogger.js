const SearchLog = require('../models/SearchLog');

const logSearchEvent = async ({
  req = null,
  query,
  resultCount = 0,
  page = 1,
  limit = 20,
  filters = {},
  startedAt = Date.now(),
  userId = null
}) => {
  if (!query) {
    return null;
  }

  try {
    return await SearchLog.create({
      query,
      normalizedQuery: query.trim().toLowerCase(),
      resultCount,
      page,
      limit,
      filters,
      latencyMs: Math.max(0, Date.now() - startedAt),
      user: userId,
      ipAddress: req ? req.ip : null,
      userAgent: req ? req.get('user-agent') : null
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[search-log] Failed to persist search log:', error.message);
    }
    return null;
  }
};

module.exports = {
  logSearchEvent
};
