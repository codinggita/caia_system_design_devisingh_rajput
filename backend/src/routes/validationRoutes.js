const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require('../utils/response');

// OPTIONS routes
router.options('/concept', (req, res) => {
  res.header('Allow', 'POST, OPTIONS').status(200).end();
});
router.options('/errors/not-found', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

// OPTIONS handler for error test endpoint
router.options('/errors/:errorType', (req, res) => {
  res.header('Allow', 'GET, OPTIONS').status(200).end();
});

/**
 * Validations
 */
router.post('/concept', (req, res) => {
  const { prompt, response, metadata } = req.body;
  const errors = [];
  if (!prompt) errors.push('prompt is required');
  if (!response) errors.push('response is required');
  if (!metadata) {
    errors.push('metadata object is required');
  } else {
    if (!metadata.category) errors.push('metadata.category is required');
    if (!metadata.subcategory) errors.push('metadata.subcategory is required');
    if (!metadata.concept) errors.push('metadata.concept is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 400, 'Concept payload validation failed', errors);
  }
  return successResponse(res, 200, 'Concept payload is valid');
});

router.patch('/concept/:id', (req, res) => {
  const updates = req.body;
  const errors = [];
  
  if (Object.keys(updates).length === 0) {
    errors.push('Request body cannot be empty for partial updates');
  }

  if (updates.metadata) {
    if (updates.metadata.category === '') errors.push('metadata.category cannot be empty');
    if (updates.metadata.subcategory === '') errors.push('metadata.subcategory cannot be empty');
    if (updates.metadata.concept === '') errors.push('metadata.concept cannot be empty');
  }

  if (errors.length > 0) {
    return errorResponse(res, 400, 'Concept update payload validation failed', errors);
  }
  return successResponse(res, 200, 'Concept update payload is valid');
});

router.post('/search', (req, res) => {
  const { q } = req.body;
  if (!q || q.trim() === '') {
    return errorResponse(res, 400, 'Search query (q) must be a non-empty string');
  }
  return successResponse(res, 200, 'Search payload is valid');
});

router.post('/tags', (req, res) => {
  const { tags } = req.body;
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return errorResponse(res, 400, 'tags must be a non-empty array of strings');
  }
  return successResponse(res, 200, 'Tags payload is valid');
});

router.post('/upload', (req, res) => {
  const { fileName, fileSize, mimeType } = req.body;
  const errors = [];
  if (!fileName) errors.push('fileName is required');
  if (fileSize > 5 * 1024 * 1024) errors.push('File size exceeds the 5MB limit');
  if (mimeType && !['image/png', 'image/jpeg', 'application/json', 'text/markdown'].includes(mimeType)) {
    errors.push('Unsupported MIME type');
  }

  if (errors.length > 0) {
    return errorResponse(res, 400, 'Upload validation failed', errors);
  }
  return successResponse(res, 200, 'Upload payload is valid');
});

/**
 * Error Simulators
 */
router.get('/errors/not-found', (req, res) => {
  return errorResponse(res, 404, 'Simulated resource not found (404)');
});

router.get('/errors/server-error', (req, res) => {
  return errorResponse(res, 500, 'Simulated internal server error (500)');
});

router.get('/errors/database', (req, res) => {
  return errorResponse(
    res,
    500,
    'Simulated database error: Connection refused to MongoDB at 127.0.0.1:27017'
  );
});

router.get('/errors/validation', (req, res) => {
  // Simulates standard mongoose validation error payload structure
  const validationErrors = {
    'metadata.category': { message: 'Path `category` is required.' },
    'prompt': { message: 'Path `prompt` is required.' }
  };
  return errorResponse(res, 400, 'Simulated validation error', validationErrors);
});

router.get('/errors/token-expired', (req, res) => {
  return errorResponse(res, 401, 'Simulated JWT expiry error: JSON Web Token has expired');
});

module.exports = router;
