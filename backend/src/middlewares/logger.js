const env = require('../config/env');

const logger = (req, res, next) => {
  if (!env.ENABLE_REQUEST_LOGGING) {
    return next();
  }

  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    const payload = [
      `requestId=${req.requestId || 'unknown'}`,
      req.method,
      req.originalUrl,
      `status=${res.statusCode}`,
      `duration=${duration}ms`,
      `ip=${req.ip}`
    ].join(' ');
    console.log(`[request] ${payload}`);
  });

  return next();
};

module.exports = logger;
