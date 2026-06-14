const User = require('../models/User');
const Concept = require('../models/Concept');
const UserProgress = require('../models/UserProgress');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../utils/errorClass');
const { successResponse } = require('../utils/response');

const ensureAnalyticsEnabled = () => {
  if (!env.ENABLE_ANALYTICS) {
    throw new AppError('Analytics module is disabled', 503, 'ANALYTICS_DISABLED');
  }
};

/**
 * @desc    Get platform-wide analytics summary for admin
 * @route   GET /api/v1/admin/analytics/summary
 * @access  Private/Admin
 */
const getSummary = asyncHandler(async (req, res) => {
  const [userCount, conceptCount, totalXP] = await Promise.all([
    User.countDocuments(),
    Concept.countDocuments(),
    UserProgress.aggregate([
      { $group: { _id: null, total: { $sum: '$xp' } } }
    ])
  ]);

  return successResponse(res, 200, 'Analytics summary fetched', {
    users: userCount,
    concepts: conceptCount,
    totalPlatformXP: totalXP[0]?.total || 0,
    timestamp: new Date()
  });
});

const getTopConcepts = asyncHandler(async (req, res) => {
  ensureAnalyticsEnabled();

  const { limit = 10 } = req.query;

  const topConcepts = await Concept.aggregate([
    { $match: { isArchived: false } },
    {
      $addFields: {
        score: {
          $add: [
            '$bookmarksCount',
            '$votesCount.up',
            { $multiply: ['$votesCount.down', -1] }
          ]
        }
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
        score: 1
      }
    }
  ]);

  return successResponse(res, 200, 'Top concepts fetched successfully', topConcepts);
});

const getCreationTrend = asyncHandler(async (req, res) => {
  ensureAnalyticsEnabled();

  const { days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const trend = await Concept.aggregate([
    {
      $match: {
        createdAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        conceptsCreated: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: '$_id',
        count: '$conceptsCreated'
      }
    }
  ]);

  return successResponse(res, 200, 'Creation trend fetched successfully', trend);
});

const getTotalConcepts = asyncHandler(async (req, res) => {
  const total = await Concept.countDocuments({ isArchived: false });
  return successResponse(res, 200, 'Total concepts count fetched', { total });
});

const getCategoryDistribution = asyncHandler(async (req, res) => {
  const distribution = await Concept.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$metadata.category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  return successResponse(res, 200, 'Category distribution fetched', distribution);
});

const getDifficultyStats = asyncHandler(async (req, res) => {
  const stats = await Concept.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$metadata.difficulty', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  return successResponse(res, 200, 'Difficulty stats fetched', stats);
});

module.exports = {
  getSummary,
  getTopConcepts,
  getCreationTrend,
  getTotalConcepts,
  getCategoryDistribution,
  getDifficultyStats
};
