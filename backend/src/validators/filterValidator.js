const Joi = require('joi');

/**
 * filterValidator.js
 * -----
 * Joi validation schemas for filter endpoint requests.
 * Validates category, difficulty, pattern, and combined filter queries.
 */

/**
 * Validate filter by category request (GET /api/v1/filter/category)
 * Expects: name (category name), page, limit
 */
const validateFilterByCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Category name cannot be empty',
        'any.required': 'Category name is required'
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

  return schema.validate(data);
};

/**
 * Validate filter by difficulty request (GET /api/v1/filter/difficulty)
 * Expects: level (difficulty level), page, limit
 */
const validateFilterByDifficulty = (data) => {
  const schema = Joi.object({
    level: Joi.string()
      .valid('beginner', 'intermediate', 'advanced')
      .required()
      .messages({
        'string.empty': 'Difficulty level cannot be empty',
        'any.required': 'Difficulty level is required',
        'any.only': 'Difficulty level must be beginner, intermediate, or advanced'
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

  return schema.validate(data);
};

/**
 * Validate filter by design pattern request (GET /api/v1/filter/pattern)
 * Expects: name (pattern name), page, limit
 */
const validateFilterByPattern = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Pattern name cannot be empty',
        'any.required': 'Pattern name is required'
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

  return schema.validate(data);
};

/**
 * Validate combined filter request (POST /api/v1/filter/combined)
 * Supports filtering by multiple criteria simultaneously
 */
const validateCombinedFilter = (data) => {
  const schema = Joi.object({
    category: Joi.string()
      .max(100)
      .optional(),
    difficulty: Joi.string()
      .valid('beginner', 'intermediate', 'advanced')
      .optional(),
    pattern: Joi.string()
      .max(100)
      .optional(),
    minVotes: Joi.number()
      .integer()
      .min(0)
      .optional(),
    maxVotes: Joi.number()
      .integer()
      .min(0)
      .optional(),
    sortBy: Joi.string()
      .valid('votes', 'date', 'views')
      .default('votes')
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
  }).min(1).messages({
    'object.min': 'At least one filter criteria must be provided'
  });

  return schema.validate(data);
};

/**
 * Validate filter categories list request (GET /api/v1/filter/categories)
 * Returns available categories for filtering
 */
const validateGetFilterCategories = (data) => {
  const schema = Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(20)
  });

  return schema.validate(data);
};

module.exports = {
  validateFilterByCategory,
  validateFilterByDifficulty,
  validateFilterByPattern,
  validateCombinedFilter,
  validateGetFilterCategories
};
