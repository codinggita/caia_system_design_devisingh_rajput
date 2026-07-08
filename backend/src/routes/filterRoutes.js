const express = require('express');
const filterController = require('../controllers/filterController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { filterSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/', validate(filterSchema, 'query'), filterController.filterConcepts);
router.get('/category', filterController.filterByCategory);
router.get('/difficulty', filterController.filterByDifficulty);
router.get('/pattern', filterController.filterByPattern);
router.get('/language', filterController.filterByLanguage);
router.get('/tags', filterController.filterByTags);
router.get('/popular', filterController.filterPopular);
router.get('/trending', filterController.filterTrending);
router.get('/frontend', filterController.filterFrontend);
router.get('/backend', filterController.filterBackend);
router.get('/devops', filterController.filterDevops);
router.get('/cloud', filterController.filterByCloud);
router.get('/date', filterController.filterByDate);
router.get('/unexplored', filterController.filterUnexplored);
router.get('/expert-only', filterController.filterExpertOnly);
router.get('/bookmarks', protect, filterController.filterMyBookmarks);

module.exports = router;
