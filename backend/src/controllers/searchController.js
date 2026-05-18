const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { logSearchEvent } = require('../utils/searchLogger');

const searchConcepts = asyncHandler(async (req, res) => {
  const startedAt = Date.now();
  const { q, page = 1, limit = 20 } = req.query;

  const filter = {
    isArchived: false,
    $or: [
      { prompt: { $regex: q, $options: 'i' } },
      { response: { $regex: q, $options: 'i' } },
      { 'metadata.concept': { $regex: q, $options: 'i' } },
      { 'metadata.category': { $regex: q, $options: 'i' } }
    ]
  };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Concept.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Concept.countDocuments(filter)
  ]);

  await logSearchEvent({
    req,
    query: q,
    resultCount: total,
    page,
    limit,
    filters: {},
    startedAt,
    userId: req.user ? req.user.id : null
  });

  return successResponse(res, 200, 'Search results fetched successfully', {
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
  searchConcepts
};
