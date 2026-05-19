const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginationMeta, resolvePagination } = require('../utils/paginator');
const { successResponse } = require('../utils/response');

const filterConcepts = asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    language,
    technology,
    pattern
  } = req.query;
  const { page, limit, skip } = resolvePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 10
  });

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

  const [items, total] = await Promise.all([
    Concept.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Concept.countDocuments(filter)
  ]);

  return successResponse(res, 200, 'Filtered concepts fetched successfully', {
    items,
    pagination: buildPaginationMeta({ page, limit, total })
  });
});

module.exports = {
  filterConcepts
};
