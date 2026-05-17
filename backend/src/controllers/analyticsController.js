const Concept = require('../models/Concept');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../utils/errorClass');
const { successResponse } = require('../utils/response');

const ensureAnalyticsEnabled = () => {
  if (!env.ENABLE_ANALYTICS) {
    throw new AppError('Analytics module is disabled', 503, 'ANALYTICS_DISABLED');
  }
};

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
        conceptsCreated: 1
      }
    }
  ]);

  return successResponse(res, 200, 'Concept creation trend fetched successfully', {
    days,
    trend
  });
});

module.exports = {
  getTopConcepts,
  getCreationTrend
};
