const Joi = require('joi');

/**
 * searchValidator.js
 * -----
 * Joi validation schemas for search endpoint requests.
 * Ensures query parameters conform to expected types and constraints.
 */

/**
 * Validate global search request (GET /api/v1/search)
 * Expects: q (search query), page (pagination), limit (page size)
 */
const validateGlobalSearch = (data) => {
  const schema = Joi.object({
    q: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Search query cannot be empty',
        'string.max': 'Search query cannot exceed 500 characters',
        'any.required': 'Search query (q) is required'
      }),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .messages({
        'number.base': 'Limit must be a number',
        'number.max': 'Limit cannot exceed 100'
      })
  });

  return schema.validate(data);
};

/**
 * Validate advanced search request (GET /api/v1/search/advanced)
 * Supports filtering by category, difficulty, and pattern
 */
const validateAdvancedSearch = (data) => {
  const schema = Joi.object({
    q: Joi.string()
      .min(1)
      .max(500)
      .required(),
    category: Joi.string()
      .max(100)
      .optional(),
    difficulty: Joi.string()
      .valid('beginner', 'intermediate', 'advanced')
      .optional(),
    pattern: Joi.string()
      .max(100)
      .optional(),
    sortBy: Joi.string()
      .valid('relevance', 'date', 'votes')
      .default('relevance')
      .optional(),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
  });

  return schema.validate(data);
};

/**
 * Validate search suggestions request (GET /api/v1/search/suggestions)
 * Returns autocomplete suggestions based on partial input
 */
const validateSearchSuggestions = (data) => {
  const schema = Joi.object({
    q: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Query prefix cannot be empty',
        'any.required': 'Query parameter (q) is required'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(20)
      .default(10)
  });

  return schema.validate(data);
};

/**
 * Validate search trends request (GET /api/v1/search/trends)
 * Returns popular and trending searches
 */
const validateSearchTrends = (data) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid('24h', '7d', '30d', '90d')
      .default('7d')
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(10)
  });

  return schema.validate(data);
};

module.exports = {
  validateGlobalSearch,
  validateAdvancedSearch,
  validateSearchSuggestions,
  validateSearchTrends
};
