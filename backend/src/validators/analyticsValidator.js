const Joi = require('joi');

/**
 * analyticsValidator.js
 * -----
 * Joi validation schemas for analytics endpoint requests.
 * Validates admin analytics queries including trends, top concepts, and user insights.
 */

/**
 * Validate trend analysis request (GET /api/v1/analytics/trends)
 * Expects: timeRange, metric (concept views, notes created, searches)
 */
const validateGetTrends = (data) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('7d')
      .optional(),
    metric: Joi.string()
      .valid('views', 'notes', 'searches', 'votes')
      .default('views')
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(10)
  });

  return schema.validate(data);
};

/**
 * Validate top concepts request (GET /api/v1/analytics/top-concepts)
 * Returns most viewed, voted, or bookmarked concepts
 */
const validateGetTopConcepts = (data) => {
  const schema = Joi.object({
    sortBy: Joi.string()
      .valid('views', 'votes', 'bookmarks')
      .default('views')
      .optional(),
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y', 'all')
      .default('30d')
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20),
    category: Joi.string()
      .max(100)
      .optional()
  });

  return schema.validate(data);
};

/**
 * Validate user insights request (GET /api/v1/analytics/user-insights)
 * Returns aggregated user activity and engagement metrics
 */
const validateGetUserInsights = (data) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('30d')
      .optional(),
    metric: Joi.string()
      .valid('active_users', 'new_users', 'engagement', 'retention')
      .default('active_users')
      .optional()
  });

  return schema.validate(data);
};

/**
 * Validate dashboard summary request (GET /api/v1/analytics/dashboard)
 * Returns comprehensive dashboard statistics
 */
const validateGetDashboardSummary = (data) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('30d')
      .optional()
  });

  return schema.validate(data);
};

/**
 * Validate category performance request (GET /api/v1/analytics/categories)
 * Returns metrics for each category (views, votes, engagement)
 */
const validateGetCategoryPerformance = (data) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('30d')
      .optional(),
    sortBy: Joi.string()
      .valid('views', 'concepts', 'engagement')
      .default('views')
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(10)
  });

  return schema.validate(data);
};

/**
 * Validate search analytics request (GET /api/v1/analytics/search)
 * Returns top searches, failed searches, and search trends
 */
const validateGetSearchAnalytics = (data) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('7d')
      .optional(),
    type: Joi.string()
      .valid('top_searches', 'failed_searches', 'trends')
      .default('top_searches')
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
  });

  return schema.validate(data);
};

/**
 * Validate content performance request (POST /api/v1/analytics/content-performance)
 * Detailed analysis for specific concepts
 */
const validateGetContentPerformance = (data) => {
  const schema = Joi.object({
    conceptIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one concept ID is required',
        'array.max': 'Cannot query more than 50 concepts at once'
      }),
    metrics: Joi.array()
      .items(
        Joi.string().valid('views', 'votes', 'bookmarks', 'completion')
      )
      .default(['views', 'votes', 'bookmarks'])
      .optional(),
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d', '1y')
      .default('30d')
      .optional()
  });

  return schema.validate(data);
};

module.exports = {
  validateGetTrends,
  validateGetTopConcepts,
  validateGetUserInsights,
  validateGetDashboardSummary,
  validateGetCategoryPerformance,
  validateGetSearchAnalytics,
  validateGetContentPerformance
};
