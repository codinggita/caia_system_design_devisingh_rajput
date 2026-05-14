/**
 * Custom Application Error Class
 * Extends Error to provide structured error information with status codes,
 * error tracking, and user-friendly messages
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Distinguishes operational errors from programming errors

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON representation
   */
  toJSON() {
    return {
      success: false,
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      timestamp: this.timestamp
    };
  }
}

/**
 * Validation Error - for request validation failures
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors
    };
  }
}

/**
 * Authentication Error - for auth/token issues
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

/**
 * Authorization Error - for permission issues
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHZ_ERROR');
  }
}

/**
 * Not Found Error - for resource not found
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * Conflict Error - for duplicate/conflict issues
 */
class ConflictError extends AppError {
  constructor(message = 'Conflict with existing resource') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Rate Limit Error - for rate limiting
 */
class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
};
