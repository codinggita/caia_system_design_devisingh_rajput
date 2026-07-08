const express = require('express');
const searchController = require('../controllers/searchController');
const { validate } = require('../middlewares/validation');
const { searchSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/', validate(searchSchema, 'query'), searchController.searchConcepts);
router.get('/autocomplete', searchController.getAutocomplete);
router.get('/fuzzy', searchController.searchConcepts);
router.get('/title', searchController.searchByTitle);
router.get('/content', searchController.searchByContent);
router.get('/tags', searchController.searchByTags);
router.get('/category', searchController.searchByCategory);
router.get('/difficulty', searchController.searchByDifficulty);
router.get('/language', searchController.searchByLanguage);
router.get('/patterns', searchController.searchByPattern);
router.get('/popular', searchController.getPopularSearches);
router.get('/recent', searchController.getRecentSearches);

module.exports = router;
