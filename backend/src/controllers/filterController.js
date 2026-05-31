const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const filterConcepts = asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    language,
    technology,
    pattern,
    page = 1,
    limit = 10
  } = req.query;

  const filter = {
    isArchived: false
  };

  if (category) {
    filter['metadata.category'] = category;
  }

  if (difficulty) {
    filter['metadata.difficulty'] = difficulty;
  }

  if (language) {
    filter['metadata.languages'] = language;
  }

  if (technology) {
    filter['metadata.technologies'] = technology;
  }

  if (pattern) {
    filter['metadata.patterns_covered'] = pattern;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Concept.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Concept.countDocuments(filter)
  ]);

  return successResponse(res, 200, 'Filtered concepts fetched successfully', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

module.exports = {
  filterConcepts
};
