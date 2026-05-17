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
    'metadata.category': req.params.name
  });

  return successResponse(res, 200, 'Subcategories fetched successfully', {
    category: req.params.name,
    subcategories: subcategories.sort()
  });
});

module.exports = {
  getCategorySummary,
  getSubcategoriesByCategory
};
