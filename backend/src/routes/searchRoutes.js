const express = require('express');
const searchController = require('../controllers/searchController');
const { validate } = require('../middlewares/validation');
const { searchSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/', validate(searchSchema, 'query'), searchController.searchConcepts);
router.get('/title', searchController.searchByTitle);
router.get('/content', searchController.searchByContent);
router.get('/tags', searchController.searchByTags);
router.get('/autocomplete', searchController.getAutocomplete);

module.exports = router;
