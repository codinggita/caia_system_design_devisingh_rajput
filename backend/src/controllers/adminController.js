const AuditLog = require('../models/AuditLog');
const Bookmark = require('../models/Bookmark');
const Concept = require('../models/Concept');
const Note = require('../models/Note');
const User = require('../models/User');
const Vote = require('../models/Vote');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { NotFoundError } = require('../utils/errorClass');
const { writeAuditLog } = require('../utils/auditLogger');

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

const getAuditLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.action) {
    filter.action = req.query.action;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.actorId) {
    filter.actor = req.query.actorId;
  }

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('actor', 'username email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(filter)
  ]);

  return successResponse(res, 200, 'Audit logs fetched successfully', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
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
  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'user.ban',
    target: {
      resource: 'user',
      id: user._id
    },
    details: {
      newState: {
        isBanned: true
      }
    }
  });
  return successResponse(res, 200, 'User banned successfully', {
    id: user._id,
    isBanned: user.isBanned
  });
});

const unbanUser = asyncHandler(async (req, res) => {
  const user = await updateUserBanStatus(req, false);
  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'user.unban',
    target: {
      resource: 'user',
      id: user._id
    },
    details: {
      newState: {
        isBanned: false
      }
    }
  });
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
  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'concept.archive',
    target: {
      resource: 'concept',
      id: concept._id
    },
    details: {
      newState: {
        isArchived: true
      }
    }
  });
  return successResponse(res, 200, 'Concept archived successfully', {
    id: concept._id,
    isArchived: concept.isArchived
  });
});

const restoreConcept = asyncHandler(async (req, res) => {
  const concept = await updateConceptArchiveStatus(req, false);
  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'concept.restore',
    target: {
      resource: 'concept',
      id: concept._id
    },
    details: {
      newState: {
        isArchived: false
      }
    }
  });
  return successResponse(res, 200, 'Concept restored successfully', {
    id: concept._id,
    isArchived: concept.isArchived
  });
});

module.exports = {
  getDashboardStats,
  getAuditLogs,
  banUser,
  unbanUser,
  archiveConcept,
  restoreConcept
};
