const express = require('express');
const router = express.Router();
const { errorResponse } = require('../utils/response');

/**
 * Error Simulation Routes
 * These routes simulate various error scenarios for testing error handling
 */

// OPTIONS for error routes
router.options('/not-found', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

router.options('/server-error', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

router.options('/database', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

router.options('/validation', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

router.options('/token-expired', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

/**
 * GET /api/v1/errors/not-found
 * Simulates 404 Not Found error
 */
router.get('/not-found', (req, res) => {
  return errorResponse(res, 404, 'Resource not found - This is a simulated 404 error');
});

/**
 * GET /api/v1/errors/server-error
 * Simulates 500 Internal Server Error
 */
router.get('/server-error', (req, res) => {
  return errorResponse(res, 500, 'Internal Server Error - This is a simulated 500 error');
});

/**
 * GET /api/v1/errors/database
 * Simulates database connection error
 */
router.get('/database', (req, res) => {
  return errorResponse(res, 503, 'Database connection error - This is a simulated database error', {
    errorType: 'DATABASE_ERROR',
    message: 'Failed to connect to MongoDB',
    details: 'Connection timeout'
  });
});

/**
 * GET /api/v1/errors/validation
 * Simulates validation error
 */
router.get('/validation', (req, res) => {
  return errorResponse(res, 400, 'Validation error - This is a simulated validation error', {
    errors: [
      { field: 'prompt', message: 'Prompt is required' },
      { field: 'response', message: 'Response is required' },
      { field: 'metadata.category', message: 'Category must be one of: microservices, caching, database, etc.' }
    ]
  });
});

/**
 * GET /api/v1/errors/token-expired
 * Simulates JWT token expiration error
 */
router.get('/token-expired', (req, res) => {
  return errorResponse(res, 401, 'Token expired - This is a simulated JWT expiry error', {
    errorType: 'TOKEN_EXPIRED',
    message: 'Your authentication token has expired',
    solution: 'Please refresh your token using /api/v1/auth/refresh-token'
  });
});

module.exports = router;
