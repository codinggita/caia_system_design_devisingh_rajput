const { errorResponse } = require('../utils/response');
const { AppError, ValidationError, AuthenticationError } = require('../utils/errorClass');

const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user ? req.user.id : 'anonymous',
      ip: req.ip
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new AppError(message, 404, 'CAST_ERROR');
    return errorResponse(res, error.statusCode, error.message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `A record with this ${field} already exists`;
    error = new AppError(message, 400, 'DUPLICATE_KEY');
    return errorResponse(res, error.statusCode, error.message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
    const message = 'Validation failed';
    return errorResponse(res, 400, message, errors);
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Your session has expired. Please login again.');
    return errorResponse(res, error.statusCode, error.message);
  }

  // JWT invalid
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid or malformed token');
    return errorResponse(res, error.statusCode, error.message);
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return errorResponse(
      res,
      err.statusCode,
      err.message,
      err.errors || null
    );
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  return errorResponse(res, statusCode, message);
};

module.exports = { notFound, errorHandler };
