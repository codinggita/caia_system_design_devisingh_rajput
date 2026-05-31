const Joi = require('joi');

/**
 * Validation schema for pagination query parameters
 */
exports.paginationSchema = Joi.object({
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
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  sort: Joi.string()
    .optional()
    .messages({
      'string.base': 'Sort must be a string'
    })
});

/**
 * Validation schema for search query
 */
exports.searchSchema = Joi.object({
  q: Joi.string()
    .required()
    .min(1)
    .max(500)
    .messages({
      'string.empty': 'Search query is required',
      'string.max': 'Search query must not exceed 500 characters'
    }),
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

/**
 * Validation schema for filtering
 */
exports.filterSchema = Joi.object({
  category: Joi.string()
    .optional(),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .optional(),
  language: Joi.string()
    .optional(),
  technology: Joi.string()
    .optional(),
  pattern: Joi.string()
    .optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
});

/**
 * Validation schema for MongoDB ObjectId
 */
exports.objectIdSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format'
    })
});

/**
 * Validation schema for rating/voting
 */
exports.voteSchema = Joi.object({
  voteType: Joi.string()
    .valid('up', 'down')
    .required()
    .messages({
      'any.only': 'Vote type must be either "up" or "down"'
    })
});

/**
 * Validation schema for category filter
 */
exports.categoryFilterSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category name is required'
    })
});

/**
 * Validation schema for difficulty filter
 */
exports.difficultyFilterSchema = Joi.object({
  level: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .required()
    .messages({
      'any.only': 'Difficulty level must be beginner, intermediate, or advanced'
    })
});

/**
 * Validation schema for date filter
 */
exports.dateFilterSchema = Joi.object({
  after: Joi.date()
    .required()
    .messages({
      'date.base': 'Invalid date format',
      'any.required': 'Date parameter (after) is required'
    })
});
