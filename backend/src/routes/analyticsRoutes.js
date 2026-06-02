const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authorize, protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { analyticsQuerySchema } = require('../validators/commonValidator');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/summary', analyticsController.getSummary);
router.get('/trends', validate(analyticsQuerySchema, 'query'), analyticsController.getCreationTrend);
router.get('/top-concepts', validate(analyticsQuerySchema, 'query'), analyticsController.getTopConcepts);
router.get('/total-concepts', analyticsController.getTotalConcepts);
router.get('/category-distribution', analyticsController.getCategoryDistribution);
router.get('/difficulty-stats', analyticsController.getDifficultyStats);

module.exports = router;
