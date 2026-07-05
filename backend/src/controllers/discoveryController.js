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

const getDailyChallenge = asyncHandler(async (req, res) => {
  // Simple daily challenge: random concept based on current date
  const count = await Concept.countDocuments({ isArchived: false });
  if (count === 0) {
    return successResponse(res, 200, 'No concepts available for challenge', null);
  }

  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const skip = dayOfYear % count;
  
  const challenge = await Concept.findOne({ isArchived: false }).skip(skip);
  
  return successResponse(res, 200, 'Daily challenge fetched successfully', challenge);
});

const getRoadmap = asyncHandler(async (req, res) => {
  const { type } = req.params;
  
  // Mapping of roadmap types to categories or keywords
  const typeMap = {
    'system-design': 'Distributed Systems',
    'backend': 'Databases & Storage',
    'frontend': 'APIs & Gateways',
    'devops': 'Infrastructure & DevOps'
  };

  const category = typeMap[type] || 'Distributed Systems';
  
  const roadmap = await Concept.find({ 
    'metadata.category': category,
    isArchived: false 
  }).limit(5);

  return successResponse(res, 200, 'Roadmap fetched successfully', roadmap);
});

const getExpertPicks = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const items = await Concept.aggregate([
    {
      $match: {
        isArchived: false,
        'metadata.difficulty': 'advanced'
      }
    },
    {
      $addFields: {
        score: scoreProjection
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: Number(limit) },
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

  return successResponse(res, 200, 'Expert picks fetched successfully', { items });
});

const getHiddenGems = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const items = await Concept.aggregate([
    {
      $match: {
        isArchived: false,
        bookmarksCount: { $lte: 5 }
      }
    },
    {
      $addFields: {
        score: scoreProjection
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: Number(limit) },
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

  return successResponse(res, 200, 'Hidden gems fetched successfully', { items });
});

const suggestNext = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const concept = await Concept.findById(id);

  if (!concept) {
    const fallback = await Concept.find({ isArchived: false }).sort({ createdAt: -1 }).limit(5);
    return successResponse(res, 200, 'Next suggestions fetched successfully', { items: fallback });
  }

  const items = await Concept.find({
    _id: { $ne: concept._id },
    'metadata.category': concept.metadata.category,
    isArchived: false
  }).limit(5);

  return successResponse(res, 200, 'Next suggestions fetched successfully', { items });
});

module.exports = {
  getTrendingConcepts,
  getRecommendedConcepts,
  getDailyChallenge,
  getRoadmap,
  getExpertPicks,
  getHiddenGems,
  suggestNext
};
