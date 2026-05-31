const express = require('express');
const categoryController = require('../controllers/categoryController');
const { validate } = require('../middlewares/validation');
const { categoryFilterSchema } = require('../validators/commonValidator');

const router = express.Router();

router.get('/summary', categoryController.getCategorySummary);
router.get('/:name/subcategories', validate(categoryFilterSchema, 'params'), categoryController.getSubcategoriesByCategory);

module.exports = router;
