const express = require('express');
const systemController = require('../controllers/systemController');
const { authorize, protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/ping', systemController.ping);
router.get('/readiness', systemController.readiness);
router.get('/info', protect, authorize('admin'), systemController.info);
router.get('/status', systemController.status);
router.get('/database/status', systemController.databaseStatus);
router.get('/uptime', systemController.getUptime);
router.get('/version', systemController.getVersion);
router.get('/cache/status', systemController.getCacheStatus);

module.exports = router;
