const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginationMeta, resolvePagination } = require('../utils/paginator');
const { successResponse } = require('../utils/response');
const { logSearchEvent } = require('../utils/searchLogger');

const searchConcepts = asyncHandler(async (req, res) => {
  const startedAt = Date.now();
  const { q } = req.query;
  const { page, limit, skip } = resolvePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 20
  });

  const filter = {
    isArchived: false,
    $or: [
      { prompt: { $regex: q, $options: 'i' } },
      { response: { $regex: q, $options: 'i' } },
      { 'metadata.concept': { $regex: q, $options: 'i' } },
      { 'metadata.category': { $regex: q, $options: 'i' } }
    ]
  };

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
    pagination: buildPaginationMeta({ page, limit, total })
  });
});

const searchByTitle = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    prompt: { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Title search results fetched successfully', items);
});

const searchByContent = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    response: { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Content search results fetched successfully', items);
});

const searchByTags = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.technologies': { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Tag search results fetched successfully', items);
});

const getAutocomplete = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    $or: [
      { prompt: { $regex: `^${q}`, $options: 'i' } },
      { 'metadata.concept': { $regex: `^${q}`, $options: 'i' } }
    ]
  }).select('prompt metadata.concept').limit(10);
  return successResponse(res, 200, 'Autocomplete suggestions fetched successfully', items);
});

const searchByCategory = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.category': { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Category search results fetched successfully', items);
});

const searchByDifficulty = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.difficulty': { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Difficulty search results fetched successfully', items);
});

const searchByLanguage = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.languages': { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Language search results fetched successfully', items);
});

const searchByPattern = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.patterns_covered': { $regex: q, $options: 'i' }
  }).limit(20);
  return successResponse(res, 200, 'Pattern search results fetched successfully', items);
});

const getPopularSearches = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const items = await Concept.find({ isArchived: false })
    .sort({ bookmarksCount: -1, 'votesCount.up': -1 })
    .limit(Number(limit))
    .select('prompt metadata.concept metadata.category metadata.difficulty');
  return successResponse(res, 200, 'Popular searches fetched successfully', items);
});

const getRecentSearches = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const items = await Concept.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .select('prompt metadata.concept metadata.category metadata.difficulty');
  return successResponse(res, 200, 'Recent searches fetched successfully', items);
});

module.exports = {
  searchConcepts,
  searchByTitle,
  searchByContent,
  searchByTags,
  searchByCategory,
  searchByDifficulty,
  searchByLanguage,
  searchByPattern,
  getAutocomplete,
  getPopularSearches,
  getRecentSearches
};
