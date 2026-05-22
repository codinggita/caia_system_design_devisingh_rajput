const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middlewares/auth');
const { validateProfile } = require('../validators/profileValidator');

router.use(protect);
router.get('/', profileController.getUserProfile);
router.put('/', validateProfile, profileController.updateUserProfile);

module.exports = router;
