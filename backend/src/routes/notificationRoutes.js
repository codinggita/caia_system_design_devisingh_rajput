const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');
const { validateNotification } = require('../validators/notificationValidator');
const { validate } = require('../middlewares/validation');
const { objectIdSchema } = require('../validators/commonValidator');

router.use(protect);
router.get('/', notificationController.getUserNotifications);
router.post('/', validateNotification, notificationController.createNotification);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', validate(objectIdSchema, 'params'), notificationController.markAsRead);

module.exports = router;
