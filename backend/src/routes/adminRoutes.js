const express = require('express');
const adminController = require('../controllers/adminController');
const { authorize, protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { objectIdSchema } = require('../validators/commonValidator');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.patch('/users/:id/ban', validate(objectIdSchema, 'params'), adminController.banUser);
router.patch('/users/:id/unban', validate(objectIdSchema, 'params'), adminController.unbanUser);
router.patch('/concepts/:id/archive', validate(objectIdSchema, 'params'), adminController.archiveConcept);
router.patch('/concepts/:id/restore', validate(objectIdSchema, 'params'), adminController.restoreConcept);

module.exports = router;
