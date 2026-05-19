const crypto = require('crypto');

const buildRequestId = () => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString('hex');
};

const requestContext = (req, res, next) => {
  const incoming = req.get('x-request-id');
  const requestId = incoming && incoming.trim() ? incoming.trim() : buildRequestId();

  req.requestId = requestId;
  res.locals.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  next();
};

module.exports = requestContext;
