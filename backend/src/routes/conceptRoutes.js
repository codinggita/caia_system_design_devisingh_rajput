const express = require('express');
const conceptController = require('../controllers/conceptController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { objectIdSchema } = require('../validators/commonValidator');
const {
  createConceptSchema,
  updateConceptSchema,
  listConceptsQuerySchema
} = require('../validators/conceptValidator');

const router = express.Router();

router.get('/', validate(listConceptsQuerySchema, 'query'), conceptController.listConcepts);
router.get('/:id', validate(objectIdSchema, 'params'), conceptController.getConceptById);
router.post('/', protect, validate(createConceptSchema), conceptController.createConcept);
router.patch('/:id', protect, validate(objectIdSchema, 'params'), validate(updateConceptSchema), conceptController.updateConcept);
router.delete('/:id', protect, validate(objectIdSchema, 'params'), conceptController.archiveConcept);

module.exports = router;
