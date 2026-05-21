const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

router.get('/', preferenceController.getUserPreferences);
router.post('/', preferenceController.updateUserPreferences);

module.exports = router;
