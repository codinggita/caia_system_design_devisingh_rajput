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

/**
 * Validation schema for analytics query options
 */
exports.analyticsQuerySchema = Joi.object({
  days: Joi.number()
    .integer()
    .min(1)
    .max(90)
    .default(30)
    .messages({
      'number.base': 'Days must be a number',
      'number.min': 'Days must be at least 1',
      'number.max': 'Days cannot exceed 90'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 20'
    })
});

/**
 * Validation schema for audit log query options
 */
exports.auditLogQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
  action: Joi.string()
    .trim()
    .optional(),
  status: Joi.string()
    .valid('success', 'failure')
    .optional(),
  actorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'actorId must be a valid MongoDB ObjectId'
    })
});

/**
 * Validation schema for user role change
 */
exports.changeRoleSchema = Joi.object({
  role: Joi.string()
    .valid('user', 'admin')
    .required()
    .messages({
      'any.only': 'Role must be either "user" or "admin"'
    })
});

/**
 * Validation schema for personal notes list query options
 */
exports.notesListQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
  sort: Joi.string()
    .valid('newest', 'oldest')
    .default('newest')
});

/**
 * Validation schema for discovery query options
 */
exports.discoveryQuerySchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),
  days: Joi.number()
    .integer()
    .min(1)
    .max(90)
    .default(30)
});
