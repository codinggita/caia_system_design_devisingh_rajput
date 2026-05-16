const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { NotFoundError, AuthorizationError } = require('../utils/errorClass');

const listConcepts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'newest',
    difficulty,
    category
  } = req.query;

  const filter = {
    isArchived: false
  };

  if (difficulty) {
    filter['metadata.difficulty'] = difficulty;
  }

  if (category) {
    filter['metadata.category'] = category;
  }

  const sortBy = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Concept.find(filter).sort(sortBy).skip(skip).limit(limit),
    Concept.countDocuments(filter)
  ]);

  return successResponse(res, 200, 'Concepts fetched successfully', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
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

  if (concept.createdBy.toString() !== req.user.id) {
    throw new AuthorizationError('You can archive only your own concepts');
  }

  concept.isArchived = true;
  await concept.save();

  return successResponse(res, 200, 'Concept archived successfully');
});

module.exports = {
  listConcepts,
  getConceptById,
  createConcept,
  updateConcept,
  archiveConcept
};
