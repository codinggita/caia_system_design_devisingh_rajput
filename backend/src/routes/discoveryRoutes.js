const express = require('express');
const discoveryController = require('../controllers/discoveryController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { discoveryQuerySchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/trending', validate(discoveryQuerySchema, 'query'), discoveryController.getTrendingConcepts);
router.get('/recommended', protect, validate(discoveryQuerySchema, 'query'), discoveryController.getRecommendedConcepts);

module.exports = router;
