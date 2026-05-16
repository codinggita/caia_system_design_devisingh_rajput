const express = require('express');
const searchController = require('../controllers/searchController');
const { validate } = require('../middlewares/validation');
const { searchSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/', validate(searchSchema, 'query'), searchController.searchConcepts);

module.exports = router;
