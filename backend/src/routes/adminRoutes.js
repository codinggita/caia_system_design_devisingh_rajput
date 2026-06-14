const express = require('express');
const adminController = require('../controllers/adminController');
const { authorize, protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { auditLogQuerySchema, objectIdSchema, changeRoleSchema } = require('../validators/commonValidator');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/audit-logs', validate(auditLogQuerySchema, 'query'), adminController.getAuditLogs);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', validate(objectIdSchema, 'params'), validate(changeRoleSchema), adminController.changeUserRole);
router.patch('/users/:id/ban', validate(objectIdSchema, 'params'), adminController.banUser);
router.patch('/users/:id/unban', validate(objectIdSchema, 'params'), adminController.unbanUser);
router.patch('/concepts/:id/archive', validate(objectIdSchema, 'params'), adminController.archiveConcept);
router.patch('/concepts/:id/restore', validate(objectIdSchema, 'params'), adminController.restoreConcept);

module.exports = router;
