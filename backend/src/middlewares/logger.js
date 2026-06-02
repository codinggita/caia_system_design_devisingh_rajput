const env = require('../config/env');

const logger = (req, res, next) => {
  if (!env.ENABLE_REQUEST_LOGGING) {
    return next();
  }

  const startedAt = Date.now();
  const requestId = req.requestId || Math.random().toString(36).substring(7);

  // Log incoming request
  if (env.NODE_ENV === 'development') {
    const body = { ...req.body };
    // Mask sensitive fields
    ['password', 'token', 'secret', 'apiKey'].forEach(field => {
      if (body[field]) {
        body[field] = '********';
      }
    });
    console.log(`[API Request] ${requestId} | ${req.method} ${req.originalUrl}`, Object.keys(body).length ? body : '');
  }

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    const payload = [
      `requestId=${requestId}`,
      req.method,
      req.originalUrl,
      `status=${res.statusCode}`,
      `duration=${duration}ms`,
      `ip=${req.ip}`
    ].join(' ');
    
    const logPrefix = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${logPrefix} [API Response] ${payload}`);
  });

  return next();
};

module.exports = logger;
