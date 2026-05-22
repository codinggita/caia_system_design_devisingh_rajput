const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');
const { protect } = require('../middlewares/auth');

router.use(protect);
router.get('/', learningPathController.getLearningPath);

module.exports = router;
