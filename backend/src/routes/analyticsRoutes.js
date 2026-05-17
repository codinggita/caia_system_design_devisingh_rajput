const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authorize, protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { analyticsQuerySchema } = require('../validators/commonValidator');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/top-concepts', validate(analyticsQuerySchema, 'query'), analyticsController.getTopConcepts);
router.get('/creation-trend', validate(analyticsQuerySchema, 'query'), analyticsController.getCreationTrend);

module.exports = router;
