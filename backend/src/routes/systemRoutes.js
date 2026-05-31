const express = require('express');
const systemController = require('../controllers/systemController');
const { authorize, protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/ping', systemController.ping);
router.get('/readiness', systemController.readiness);
router.get('/info', protect, authorize('admin'), systemController.info);

module.exports = router;
