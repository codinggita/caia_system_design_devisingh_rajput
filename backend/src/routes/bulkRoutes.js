const express = require('express');
const bulkController = require('../controllers/bulkController');
const { authorize, protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { archiveConceptsSchema, bulkCreateConceptsSchema } = require('../validators/conceptValidator');

const router = express.Router();

router.use(protect, authorize('admin'));

router.post('/concepts', validate(bulkCreateConceptsSchema), bulkController.bulkCreateConcepts);
router.patch('/concepts/archive', validate(archiveConceptsSchema), bulkController.bulkArchiveConcepts);
router.patch('/concepts/restore', validate(archiveConceptsSchema), bulkController.bulkRestoreConcepts);

module.exports = router;
