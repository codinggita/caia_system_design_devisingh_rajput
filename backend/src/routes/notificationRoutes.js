const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');
const { validateNotification } = require('../validators/notificationValidator');

router.use(protect);
router.get('/', notificationController.getUserNotifications);
router.post('/', validateNotification, notificationController.createNotification);

module.exports = router;
