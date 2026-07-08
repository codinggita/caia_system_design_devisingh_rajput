const express = require('express');
const discoveryController = require('../controllers/discoveryController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { discoveryQuerySchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/trending', validate(discoveryQuerySchema, 'query'), discoveryController.getTrendingConcepts);
router.get('/recommended', protect, validate(discoveryQuerySchema, 'query'), discoveryController.getRecommendedConcepts);
router.get('/daily-challenge', discoveryController.getDailyChallenge);
router.get('/expert-picks', validate(discoveryQuerySchema, 'query'), discoveryController.getExpertPicks);
router.get('/hidden-gems', validate(discoveryQuerySchema, 'query'), discoveryController.getHiddenGems);
router.get('/suggest-next/:id', discoveryController.suggestNext);
router.get('/roadmap/:type', discoveryController.getRoadmap);

module.exports = router;
