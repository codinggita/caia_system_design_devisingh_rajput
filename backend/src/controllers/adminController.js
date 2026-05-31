const Bookmark = require('../models/Bookmark');
const Concept = require('../models/Concept');
const Note = require('../models/Note');
const User = require('../models/User');
const Vote = require('../models/Vote');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { NotFoundError } = require('../utils/errorClass');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, concepts, archivedConcepts, bookmarks, notes, votes] = await Promise.all([
    User.countDocuments(),
    Concept.countDocuments({ isArchived: false }),
    Concept.countDocuments({ isArchived: true }),
    Bookmark.countDocuments(),
    Note.countDocuments(),
    Vote.countDocuments()
  ]);

  return successResponse(res, 200, 'Admin dashboard stats fetched successfully', {
    users,
    concepts,
    archivedConcepts,
    bookmarks,
    notes,
    votes
  });
});

const updateUserBanStatus = async (req, isBanned) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.isBanned = isBanned;
  await user.save();

  return user;
};

const banUser = asyncHandler(async (req, res) => {
  const user = await updateUserBanStatus(req, true);
  return successResponse(res, 200, 'User banned successfully', {
    id: user._id,
    isBanned: user.isBanned
  });
});

const unbanUser = asyncHandler(async (req, res) => {
  const user = await updateUserBanStatus(req, false);
  return successResponse(res, 200, 'User unbanned successfully', {
    id: user._id,
    isBanned: user.isBanned
  });
});

const updateConceptArchiveStatus = async (req, isArchived) => {
  const concept = await Concept.findById(req.params.id);

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  concept.isArchived = isArchived;
  await concept.save();

  return concept;
};

const archiveConcept = asyncHandler(async (req, res) => {
  const concept = await updateConceptArchiveStatus(req, true);
  return successResponse(res, 200, 'Concept archived successfully', {
    id: concept._id,
    isArchived: concept.isArchived
  });
});

const restoreConcept = asyncHandler(async (req, res) => {
  const concept = await updateConceptArchiveStatus(req, false);
  return successResponse(res, 200, 'Concept restored successfully', {
    id: concept._id,
    isArchived: concept.isArchived
  });
});

module.exports = {
  getDashboardStats,
  banUser,
  unbanUser,
  archiveConcept,
  restoreConcept
};
