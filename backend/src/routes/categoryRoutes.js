const express = require('express');
const categoryController = require('../controllers/categoryController');
const { validate } = require('../middlewares/validation');
const { categoryFilterSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.get('/summary', categoryController.getCategorySummary);
router.get('/subcategories', categoryController.listSubcategories);
router.get('/tags', categoryController.listTags);
router.get('/patterns', categoryController.listPatterns);
router.get('/languages', categoryController.listLanguages);
router.get('/difficulty', categoryController.listDifficultyLevels);
router.get('/question-types', categoryController.listQuestionTypes);
router.get('/:name', categoryController.getSubcategoriesByCategory);

module.exports = router;
