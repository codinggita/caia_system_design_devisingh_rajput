const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middlewares/auth');
const { validateProgress } = require('../validators/progressValidator');

router.use(protect);
router.get('/', progressController.getUserProgress);
router.put('/', validateProgress, progressController.updateUserProgress);

module.exports = router;
