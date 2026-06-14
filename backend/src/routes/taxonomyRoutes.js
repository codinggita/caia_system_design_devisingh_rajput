const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// HEAD and OPTIONS
router.head('/categories', (req, res) => res.status(200).end());
router.options('/categories', (req, res) => {
  res.header('Allow', 'GET, HEAD, OPTIONS').status(200).end();
});
router.head('/patterns', (req, res) => res.status(200).end());
router.options('/patterns', (req, res) => {
  res.header('Allow', 'GET, HEAD, OPTIONS').status(200).end();
});

// Categories
router.get('/categories', categoryController.listCategories);
router.get('/categories/:category', categoryController.getSubcategoriesByCategory);
router.get('/categories/:category/concepts', categoryController.getConceptsByCategory);

// Subcategories
router.get('/subcategories', categoryController.listSubcategories);

// Tags
router.get('/tags', categoryController.listTags);
router.get('/tags/:tag', categoryController.getConceptsByTag);

// Patterns
router.get('/patterns', categoryController.listPatterns);
router.get('/patterns/:pattern', categoryController.getConceptsByPattern);

// Languages
router.get('/languages', categoryController.listLanguages);
router.get('/languages/:language', categoryController.getConceptsByLanguage);

// Difficulty
router.get('/difficulty', categoryController.listDifficultyLevels);
router.get('/difficulty/:level', categoryController.getConceptsByDifficulty);

// Question Types
router.get('/question-types', categoryController.listQuestionTypes);
router.get('/question-types/:type', categoryController.getConceptsByType);

module.exports = router;
