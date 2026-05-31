const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middlewares/auth');
const { validateAchievement } = require('../validators/achievementValidator');

router.use(protect);
router.get('/', achievementController.getUserAchievements);
router.post('/', validateAchievement, achievementController.createOrUpdateAchievement);

module.exports = router;
