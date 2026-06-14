const express = require('express');
const filterController = require('../controllers/filterController');
const { validate } = require('../middlewares/validation');
const { filterSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/', validate(filterSchema, 'query'), filterController.filterConcepts);
router.get('/category', filterController.filterByCategory);
router.get('/difficulty', filterController.filterByDifficulty);
router.get('/pattern', filterController.filterByPattern);

module.exports = router;
