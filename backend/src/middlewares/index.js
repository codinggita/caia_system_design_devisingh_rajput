// Centralized middleware exports for easy importing

const { protect, authorize } = require('./auth');
const { notFound, errorHandler } = require('./error');
const { validate, validateRequest } = require('./validation');
const logger = require('./logger');
const rateLimit = require('./rateLimit');

module.exports = {
  protect,
  authorize,
  notFound,
  errorHandler,
  validate,
  validateRequest,
  logger,
  rateLimit
};
