const express = require('express');
const voteController = require('../controllers/voteController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { objectIdSchema, voteSchema } = require('../validators/commonValidator');

const router = express.Router();

router.post('/:id', protect, validate(objectIdSchema, 'params'), validate(voteSchema), voteController.upsertVote);
router.delete('/:id', protect, validate(objectIdSchema, 'params'), voteController.removeVote);

module.exports = router;
