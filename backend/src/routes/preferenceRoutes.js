const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { preferencesSchema } = require('../validators/preferencesValidator');

router.use(protect);

router.get('/', preferenceController.getUserPreferences);
router.post('/', validate(preferencesSchema), preferenceController.updateUserPreferences);
router.patch('/', validate(preferencesSchema), preferenceController.updateUserPreferences);

module.exports = router;
