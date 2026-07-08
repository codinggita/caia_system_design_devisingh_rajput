const Concept = require('../models/Concept');
const Bookmark = require('../models/Bookmark');
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

const filterByCategory = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.category': name
  }).limit(20);
  return successResponse(res, 200, 'Concepts filtered by category fetched successfully', items);
});

const filterByDifficulty = asyncHandler(async (req, res) => {
  const { level } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.difficulty': level
  }).limit(20);
  return successResponse(res, 200, 'Concepts filtered by difficulty fetched successfully', items);
});

const filterByPattern = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.patterns_covered': name
  }).limit(20);
  return successResponse(res, 200, 'Concepts filtered by pattern fetched successfully', items);
});

const filterByLanguage = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const items = await Concept.find({
    isArchived: false,
    'metadata.languages': name
  }).limit(20);
  return successResponse(res, 200, 'Concepts filtered by language fetched successfully', items);
});

const filterByTags = asyncHandler(async (req, res) => {
  const { list } = req.query;
  const tags = list ? list.split(',').map(t => t.trim()) : [];
  const filter = { isArchived: false };
  if (tags.length > 0) {
    filter['metadata.technologies'] = { $in: tags };
  }
  const items = await Concept.find(filter).limit(20);
  return successResponse(res, 200, 'Concepts filtered by tags fetched successfully', items);
});

const filterPopular = asyncHandler(async (req, res) => {
  const items = await Concept.find({ isArchived: false })
    .sort({ bookmarksCount: -1, 'votesCount.up': -1 })
    .limit(20);
  return successResponse(res, 200, 'Popular concepts fetched successfully', items);
});

const filterTrending = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const items = await Concept.find({ isArchived: false, createdAt: { $gte: since } })
    .sort({ bookmarksCount: -1, 'votesCount.up': -1 })
    .limit(20);
  return successResponse(res, 200, 'Trending concepts fetched successfully', items);
});

const filterFrontend = asyncHandler(async (req, res) => {
  const items = await Concept.find({
    isArchived: false,
    $or: [
      { 'metadata.category': { $regex: 'frontend', $options: 'i' } },
      { 'metadata.technologies': { $in: [/react/i, /vue/i, /angular/i, /css/i, /html/i] } }
    ]
  }).limit(20);
  return successResponse(res, 200, 'Frontend concepts fetched successfully', items);
});

const filterBackend = asyncHandler(async (req, res) => {
  const items = await Concept.find({
    isArchived: false,
    $or: [
      { 'metadata.category': { $regex: 'backend', $options: 'i' } },
      { 'metadata.category': { $regex: 'database', $options: 'i' } },
      { 'metadata.category': { $regex: 'api', $options: 'i' } }
    ]
  }).limit(20);
  return successResponse(res, 200, 'Backend concepts fetched successfully', items);
});

const filterDevops = asyncHandler(async (req, res) => {
  const items = await Concept.find({
    isArchived: false,
    $or: [
      { 'metadata.category': { $regex: 'devops', $options: 'i' } },
      { 'metadata.category': { $regex: 'infrastructure', $options: 'i' } },
      { 'metadata.technologies': { $in: [/docker/i, /kubernetes/i, /ci\/cd/i] } }
    ]
  }).limit(20);
  return successResponse(res, 200, 'DevOps concepts fetched successfully', items);
});

const filterByCloud = asyncHandler(async (req, res) => {
  const items = await Concept.find({
    isArchived: false,
    $or: [
      { 'metadata.cloud_platforms': { $exists: true, $ne: [] } },
      { 'metadata.category': { $regex: 'cloud', $options: 'i' } }
    ]
  }).limit(20);
  return successResponse(res, 200, 'Cloud concepts fetched successfully', items);
});

const filterByDate = asyncHandler(async (req, res) => {
  const { after } = req.query;
  const filter = { isArchived: false };
  if (after) {
    filter.createdAt = { $gte: new Date(after) };
  }
  const items = await Concept.find(filter).sort({ createdAt: -1 }).limit(20);
  return successResponse(res, 200, 'Concepts filtered by date fetched successfully', items);
});

const filterUnexplored = asyncHandler(async (req, res) => {
  const items = await Concept.find({ isArchived: false, bookmarksCount: 0 })
    .sort({ createdAt: -1 })
    .limit(20);
  return successResponse(res, 200, 'Unexplored concepts fetched successfully', items);
});

const filterExpertOnly = asyncHandler(async (req, res) => {
  const items = await Concept.find({ isArchived: false, 'metadata.difficulty': 'advanced' })
    .sort({ bookmarksCount: -1 })
    .limit(20);
  return successResponse(res, 200, 'Expert-only concepts fetched successfully', items);
});

const filterMyBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const bookmarks = await Bookmark.find({ user: userId }).select('concept').lean();
  const conceptIds = bookmarks.map(b => b.concept);
  const items = await Concept.find({ _id: { $in: conceptIds }, isArchived: false })
    .sort({ createdAt: -1 });
  return successResponse(res, 200, 'Bookmarked concepts fetched successfully', items);
});

module.exports = {
  filterConcepts,
  filterByCategory,
  filterByDifficulty,
  filterByPattern,
  filterByLanguage,
  filterByTags,
  filterPopular,
  filterTrending,
  filterFrontend,
  filterBackend,
  filterDevops,
  filterByCloud,
  filterByDate,
  filterUnexplored,
  filterExpertOnly,
  filterMyBookmarks
};
