const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginationMeta, resolvePagination } = require('../utils/paginator');
const { successResponse } = require('../utils/response');
const { NotFoundError, AuthorizationError } = require('../utils/errorClass');

const listConcepts = asyncHandler(async (req, res) => {
  const {
    sort = 'newest',
    difficulty,
    category,
    search
  } = req.query;
  const { page, limit, skip } = resolvePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 10
  });

  const filter = {
    isArchived: false
  };

  if (difficulty) {
    filter['metadata.difficulty'] = difficulty;
  }

  if (category) {
    filter['metadata.category'] = category;
  }

  if (search) {
    filter.$or = [
      { prompt: { $regex: search, $options: 'i' } },
      { response: { $regex: search, $options: 'i' } },
      { 'metadata.concept': { $regex: search, $options: 'i' } },
      { 'metadata.technologies': { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortBy = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Concept.find(filter).sort(sortBy).skip(skip).limit(limit),
    Concept.countDocuments(filter)
  ]);

  return successResponse(res, 200, 'Concepts fetched successfully', {
    items,
    pagination: buildPaginationMeta({ page, limit, total })
  });
});

const getConceptById = asyncHandler(async (req, res) => {
  const concept = await Concept.findOne({ _id: req.params.id, isArchived: false });

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  return successResponse(res, 200, 'Concept fetched successfully', concept);
});

const createConcept = asyncHandler(async (req, res) => {
  const concept = await Concept.create({
    ...req.body,
    createdBy: req.user.id
  });

  return successResponse(res, 201, 'Concept created successfully', concept);
});

const updateConcept = asyncHandler(async (req, res) => {
  const concept = await Concept.findById(req.params.id);

  if (!concept || concept.isArchived) {
    throw new NotFoundError('Concept not found');
  }

  if (concept.createdBy.toString() !== req.user.id) {
    throw new AuthorizationError('You can update only your own concepts');
  }

  Object.assign(concept, req.body);
  await concept.save();

  return successResponse(res, 200, 'Concept updated successfully', concept);
});

const archiveConcept = asyncHandler(async (req, res) => {
  const concept = await Concept.findById(req.params.id);

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  concept.isArchived = true;
  await concept.save();

  return successResponse(res, 200, 'Concept archived successfully');
});

const restoreConcept = asyncHandler(async (req, res) => {
  const concept = await Concept.findById(req.params.id);

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  concept.isArchived = false;
  await concept.save();

  return successResponse(res, 200, 'Concept restored successfully');
});

const getRandomConcept = asyncHandler(async (req, res) => {
  const count = await Concept.countDocuments({ isArchived: false });
  const random = Math.floor(Math.random() * count);
  const concept = await Concept.findOne({ isArchived: false }).skip(random);

  if (!concept) {
    throw new NotFoundError('No concepts found');
  }

  return successResponse(res, 200, 'Random concept fetched successfully', concept);
});

const getLatestConcepts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const concepts = await Concept.find({ isArchived: false }).sort({ createdAt: -1 }).limit(Number(limit));

  return successResponse(res, 200, 'Latest concepts fetched successfully', concepts);
});

const getPopularConcepts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const concepts = await Concept.find({ isArchived: false }).sort({ bookmarksCount: -1 }).limit(Number(limit));

  return successResponse(res, 200, 'Popular concepts fetched successfully', concepts);
});

const getRelatedConcepts = asyncHandler(async (req, res) => {
  const concept = await Concept.findById(req.params.id);

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  const related = await Concept.find({
    _id: { $ne: concept._id },
    'metadata.category': concept.metadata.category,
    isArchived: false
  }).limit(5);

  return successResponse(res, 200, 'Related concepts fetched successfully', related);
});

const getConceptSummary = asyncHandler(async (req, res) => {
  const concept = await Concept.findById(req.params.id);

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  // Simplified summary for now
  const summary = {
    _id: concept._id,
    prompt: concept.prompt,
    category: concept.metadata.category,
    difficulty: concept.metadata.difficulty,
    summary: concept.response.substring(0, 200) + '...'
  };

  return successResponse(res, 200, 'Concept summary fetched successfully', summary);
});

// Bulk Operations
const bulkCreateConcepts = asyncHandler(async (req, res) => {
  const conceptsToInsert = req.body.concepts.map((concept) => ({
    ...concept,
    createdBy: req.user.id
  }));

  const inserted = await Concept.insertMany(conceptsToInsert, { ordered: false });

  return successResponse(res, 201, 'Concepts created in bulk successfully', {
    totalRequested: conceptsToInsert.length,
    totalCreated: inserted.length
  });
});

const bulkArchiveConcepts = asyncHandler(async (req, res) => {
  const { conceptIds } = req.body;
  const result = await Concept.updateMany(
    { _id: { $in: conceptIds } },
    { $set: { isArchived: true } }
  );

  return successResponse(res, 200, 'Concepts archived in bulk successfully', result);
});

const bulkRestoreConcepts = asyncHandler(async (req, res) => {
  const { conceptIds } = req.body;
  const result = await Concept.updateMany(
    { _id: { $in: conceptIds } },
    { $set: { isArchived: false } }
  );

  return successResponse(res, 200, 'Concepts restored in bulk successfully', result);
});

const bulkDeleteConcepts = asyncHandler(async (req, res) => {
  const { conceptIds } = req.body;
  const result = await Concept.deleteMany(
    { _id: { $in: conceptIds } }
  );

  return successResponse(res, 200, 'Concepts deleted in bulk successfully', result);
});

module.exports = {
  listConcepts,
  getConceptById,
  createConcept,
  updateConcept,
  archiveConcept,
  restoreConcept,
  getRandomConcept,
  getLatestConcepts,
  getPopularConcepts,
  getRelatedConcepts,
  getConceptSummary,
  bulkCreateConcepts,
  bulkArchiveConcepts,
  bulkRestoreConcepts,
  bulkDeleteConcepts
};
