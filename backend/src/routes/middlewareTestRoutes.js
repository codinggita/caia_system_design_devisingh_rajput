const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { successResponse } = require('../utils/response');
const compression = require('compression');
const limiter = require('../middlewares/rateLimit');

// Protected concept test routes
router.get('/protected/concepts', protect, (req, res) => {
  return successResponse(res, 200, 'Authenticated access to protected concepts list', { userId: req.user.id });
});

router.post('/protected/concepts', protect, (req, res) => {
  return successResponse(res, 201, 'Authenticated concept creation request approved');
});

router.patch('/protected/concepts/:id', protect, (req, res) => {
  return successResponse(res, 200, `Authenticated concept update request approved for id ${req.params.id}`);
});

router.delete('/protected/concepts/:id', protect, (req, res) => {
  return successResponse(res, 200, `Authenticated concept deletion request approved for id ${req.params.id}`);
});

router.get('/admin/protected/dashboard', protect, authorize('admin'), (req, res) => {
  return successResponse(res, 200, 'Admin authorized access to dashboard');
});

// Middleware testers
router.get('/middleware/logger', (req, res) => {
  return successResponse(res, 200, 'Logger middleware execution test successful');
});

router.get('/middleware/auth', protect, (req, res) => {
  return successResponse(res, 200, 'Authentication middleware verification successful', { user: req.user });
});

router.get('/middleware/rate-limit', limiter, (req, res) => {
  return successResponse(res, 200, 'Rate limit test passed');
});

router.get('/middleware/cache', (req, res) => {
  // Mock cache middleware execution
  res.header('X-Cache', 'HIT');
  return successResponse(res, 200, 'Cache middleware execution successful (Header X-Cache: HIT set)');
});

router.get('/middleware/compression', compression(), (req, res) => {
  return successResponse(res, 200, 'Compression middleware execution test successful (gzip enabled)');
});

module.exports = router;
