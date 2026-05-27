// utils/errorResponse.js
// ------------------------------------------------------------
// This helper creates a standard error object that can be
// returned by the centralized error handling middleware.
// It makes sure every error has a message, a HTTP status code
// and optionally a stack trace (shown only in development).
// ------------------------------------------------------------

class ErrorResponse extends Error {
  /**
   * @param {string} message - Human readable error message
   * @param {number} statusCode - HTTP status code (e.g., 404, 500)
   */
  constructor(message, statusCode) {
    super(message); // call parent Error constructor
    this.statusCode = statusCode;
    // Capture stack trace (excluding this constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
