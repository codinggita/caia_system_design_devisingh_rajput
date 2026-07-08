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

// HEAD and OPTIONS
router.head('/', (req, res) => res.status(200).end());
router.options('/', (req, res) => {
  res.header('Allow', 'GET, POST, HEAD, OPTIONS').status(200).end();
});
router.head('/:id', (req, res) => res.status(200).end());
router.options('/:id', (req, res) => {
  res.header('Allow', 'GET, PATCH, DELETE, HEAD, OPTIONS').status(200).end();
});

router.get('/', validate(listConceptsQuerySchema, 'query'), conceptController.listConcepts);
router.get('/random', conceptController.getRandomConcept);
router.get('/latest', conceptController.getLatestConcepts);
router.get('/popular', conceptController.getPopularConcepts);
router.get('/trending', conceptController.getPopularConcepts);
router.get('/:id', validate(objectIdSchema, 'params'), conceptController.getConceptById);
router.get('/:id/summary', validate(objectIdSchema, 'params'), conceptController.getConceptSummary);
router.get('/:id/related', validate(objectIdSchema, 'params'), conceptController.getRelatedConcepts);

router.post('/', protect, validate(createConceptSchema), conceptController.createConcept);
router.patch('/:id', protect, validate(objectIdSchema, 'params'), validate(updateConceptSchema), conceptController.updateConcept);
router.delete('/:id', protect, validate(objectIdSchema, 'params'), conceptController.archiveConcept);
router.patch('/:id/archive', protect, validate(objectIdSchema, 'params'), conceptController.archiveConcept);
router.patch('/:id/restore', protect, validate(objectIdSchema, 'params'), conceptController.restoreConcept);

// Bulk Operations
router.post('/bulk/create', protect, conceptController.bulkCreateConcepts);
router.patch('/bulk/archive', protect, conceptController.bulkArchiveConcepts);
router.patch('/bulk/restore', protect, conceptController.bulkRestoreConcepts);
router.delete('/bulk/delete', protect, conceptController.bulkDeleteConcepts);

module.exports = router;
