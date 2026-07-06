const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getCategorySummary = asyncHandler(async (req, res) => {
  const summary = await Concept.aggregate([
    { $match: { isArchived: false } },
    {
      $group: {
        _id: {
          category: '$metadata.category',
          difficulty: '$metadata.difficulty'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.category',
        totalConcepts: { $sum: '$count' },
        difficultyBreakdown: {
          $push: {
            difficulty: '$_id.difficulty',
            count: '$count'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalConcepts: 1,
        difficultyBreakdown: 1
      }
    },
    { $sort: { totalConcepts: -1, category: 1 } }
  ]);

  return successResponse(res, 200, 'Category summary fetched successfully', summary);
});

const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const subcategories = await Concept.distinct('metadata.subcategory', {
    isArchived: false,
    'metadata.category': req.params.category
  });

  return successResponse(res, 200, 'Subcategories fetched successfully', {
    category: req.params.category,
    subcategories: subcategories.sort()
  });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Concept.distinct('metadata.category', { isArchived: false });
  return successResponse(res, 200, 'Categories fetched successfully', categories.sort());
});

const listSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await Concept.distinct('metadata.subcategory', { isArchived: false });
  return successResponse(res, 200, 'Subcategories fetched successfully', subcategories.sort());
});

const listTags = asyncHandler(async (req, res) => {
  const tags = await Concept.distinct('metadata.technologies', { isArchived: false });
  return successResponse(res, 200, 'Tags fetched successfully', tags.sort());
});

const listPatterns = asyncHandler(async (req, res) => {
  const patterns = await Concept.distinct('metadata.patterns_covered', { isArchived: false });
  return successResponse(res, 200, 'Patterns fetched successfully', patterns.sort());
});

const listLanguages = asyncHandler(async (req, res) => {
  const languages = await Concept.distinct('metadata.languages', { isArchived: false });
  return successResponse(res, 200, 'Languages fetched successfully', languages.sort());
});

const listDifficultyLevels = asyncHandler(async (req, res) => {
  const levels = await Concept.distinct('metadata.difficulty', { isArchived: false });
  return successResponse(res, 200, 'Difficulty levels fetched successfully', levels.sort());
});

const listQuestionTypes = asyncHandler(async (req, res) => {
  const types = await Concept.distinct('metadata.question_type', { isArchived: false });
  return successResponse(res, 200, 'Question types fetched successfully', types.sort());
});

const getConceptsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const concepts = await Concept.find({
    'metadata.technologies': tag,
    isArchived: false
  });
  return successResponse(res, 200, `Concepts for tag ${tag} fetched successfully`, concepts);
});

const getConceptsByPattern = asyncHandler(async (req, res) => {
  const { pattern } = req.params;
  const concepts = await Concept.find({
    'metadata.patterns_covered': pattern,
    isArchived: false
  });
  return successResponse(res, 200, `Concepts for pattern ${pattern} fetched successfully`, concepts);
});

const getConceptsByLanguage = asyncHandler(async (req, res) => {
  const { language } = req.params;
  const concepts = await Concept.find({
    'metadata.languages': language,
    isArchived: false
  });
  return successResponse(res, 200, `Concepts for language ${language} fetched successfully`, concepts);
});

const getConceptsByDifficulty = asyncHandler(async (req, res) => {
  const { level } = req.params;
  const concepts = await Concept.find({
    'metadata.difficulty': level,
    isArchived: false
  });
  return successResponse(res, 200, `Concepts for difficulty ${level} fetched successfully`, concepts);
});

const getConceptsByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const concepts = await Concept.find({
    'metadata.question_type': type,
    isArchived: false
  });
  return successResponse(res, 200, `Concepts for type ${type} fetched successfully`, concepts);
});

const getConceptsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const concepts = await Concept.find({
    'metadata.category': category,
    isArchived: false
  });
  return successResponse(res, 200, `Concepts for category ${category} fetched successfully`, concepts);
});

module.exports = {
  getCategorySummary,
  getSubcategoriesByCategory,
  listCategories,
  listSubcategories,
  listTags,
  listPatterns,
  listLanguages,
  listDifficultyLevels,
  listQuestionTypes,
  getConceptsByTag,
  getConceptsByPattern,
  getConceptsByLanguage,
  getConceptsByDifficulty,
  getConceptsByType,
  getConceptsByCategory
};
