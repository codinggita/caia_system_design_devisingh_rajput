const Bookmark = require('../models/Bookmark');
const Concept = require('../models/Concept');
const Note = require('../models/Note');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const scoreProjection = {
  $add: [
    '$bookmarksCount',
    '$votesCount.up',
    { $multiply: ['$votesCount.down', -1] }
  ]
};

const getTrendingConcepts = asyncHandler(async (req, res) => {
  const { limit = 10, days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const items = await Concept.aggregate([
    {
      $match: {
        isArchived: false,
        createdAt: { $gte: since }
      }
    },
    {
      $addFields: {
        score: scoreProjection
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        prompt: 1,
        metadata: 1,
        bookmarksCount: 1,
        votesCount: 1,
        score: 1,
        createdAt: 1
      }
    }
  ]);

  return successResponse(res, 200, 'Trending concepts fetched successfully', {
    days,
    limit,
    items
  });
});

const collectUserSignals = async (userId) => {
  const [bookmarks, notes, votes] = await Promise.all([
    Bookmark.find({ user: userId }).select('concept -_id'),
    Note.find({ user: userId }).select('concept -_id'),
    Vote.find({ user: userId }).select('concept -_id')
  ]);

  const conceptIdSet = new Set();
  [...bookmarks, ...notes, ...votes].forEach((entry) => {
    conceptIdSet.add(entry.concept.toString());
  });

  return [...conceptIdSet];
};

const getRecommendedConcepts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const interactedIds = await collectUserSignals(req.user.id);
  const interactedObjectIds = interactedIds.map((id) => new mongoose.Types.ObjectId(id));

  if (interactedIds.length === 0) {
    const fallback = await Concept.aggregate([
      {
        $match: {
          isArchived: false
        }
      },
      {
        $addFields: {
          score: scoreProjection
        }
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $limit: limit }
    ]);

    return successResponse(res, 200, 'Recommended concepts fetched successfully', {
      strategy: 'fallback_trending',
      items: fallback
    });
  }

  const interactedConcepts = await Concept.find({
    _id: { $in: interactedObjectIds },
    isArchived: false
  }).select('metadata.category metadata.difficulty');

  const categories = [...new Set(interactedConcepts.map((item) => item.metadata.category))];
  const difficulties = [...new Set(interactedConcepts.map((item) => item.metadata.difficulty))];

  const items = await Concept.aggregate([
    {
      $match: {
        isArchived: false,
        _id: { $nin: interactedObjectIds },
        $or: [
          { 'metadata.category': { $in: categories } },
          { 'metadata.difficulty': { $in: difficulties } }
        ]
      }
    },
    {
      $addFields: {
        score: scoreProjection
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        prompt: 1,
        metadata: 1,
        bookmarksCount: 1,
        votesCount: 1,
        score: 1,
        createdAt: 1
      }
    }
  ]);

  return successResponse(res, 200, 'Recommended concepts fetched successfully', {
    strategy: 'interest_based',
    signals: {
      categories,
      difficulties,
      interactedCount: interactedIds.length
    },
    items
  });
});

module.exports = {
  getTrendingConcepts,
  getRecommendedConcepts
};
