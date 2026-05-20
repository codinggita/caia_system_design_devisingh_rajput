const Joi = require('joi');

/**
 * bulkValidator.js
 * -----
 * Joi validation schemas for bulk operation requests.
 * Validates bulk create, archive, restore, and delete operations.
 */

/**
 * Validate bulk create concepts request (POST /api/v1/bulk/create)
 * Supports creating multiple concepts in one request
 */
const validateBulkCreate = (data) => {
  const schema = Joi.object({
    concepts: Joi.array()
      .items(
        Joi.object({
          title: Joi.string()
            .min(3)
            .max(200)
            .required(),
          description: Joi.string()
            .min(10)
            .max(5000)
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
          prerequisites: Joi.array()
            .items(Joi.string())
            .optional(),
          keyPoints: Joi.array()
            .items(Joi.string().max(500))
            .optional()
        })
      )
      .min(1)
      .max(100)
      .required()
      .messages({
        'array.min': 'At least one concept must be provided',
        'array.max': 'Cannot create more than 100 concepts at once'
      })
  });

  return schema.validate(data);
};

/**
 * Validate bulk archive request (POST /api/v1/bulk/archive)
 * Archives multiple concepts by ID
 */
const validateBulkArchive = (data) => {
  const schema = Joi.object({
    conceptIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .max(500)
      .required()
      .messages({
        'array.min': 'At least one concept ID is required',
        'array.max': 'Cannot archive more than 500 concepts at once'
      }),
    reason: Joi.string()
      .max(500)
      .optional()
  });

  return schema.validate(data);
};

/**
 * Validate bulk restore request (POST /api/v1/bulk/restore)
 * Restores multiple archived concepts
 */
const validateBulkRestore = (data) => {
  const schema = Joi.object({
    conceptIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .max(500)
      .required()
      .messages({
        'array.min': 'At least one concept ID is required',
        'array.max': 'Cannot restore more than 500 concepts at once'
      })
  });

  return schema.validate(data);
};

/**
 * Validate bulk delete request (DELETE /api/v1/bulk/delete)
 * Permanently deletes multiple concepts
 */
const validateBulkDelete = (data) => {
  const schema = Joi.object({
    conceptIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .max(100)
      .required()
      .messages({
        'array.min': 'At least one concept ID is required',
        'array.max': 'Cannot delete more than 100 concepts at once'
      }),
    confirmation: Joi.string()
      .valid('DELETE')
      .required()
      .messages({
        'any.only': 'Confirmation must be "DELETE" to proceed'
      })
  });

  return schema.validate(data);
};

/**
 * Validate bulk update metadata request (POST /api/v1/bulk/update-metadata)
 * Updates metadata for multiple concepts
 */
const validateBulkUpdateMetadata = (data) => {
  const schema = Joi.object({
    conceptIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .max(500)
      .required(),
    updates: Joi.object({
      category: Joi.string()
        .max(100)
        .optional(),
      difficulty: Joi.string()
        .valid('beginner', 'intermediate', 'advanced')
        .optional(),
      pattern: Joi.string()
        .max(100)
        .optional(),
      tags: Joi.array()
        .items(Joi.string().max(50))
        .optional()
    })
      .min(1)
      .required()
      .messages({
        'object.min': 'At least one field must be specified for update'
      })
  });

  return schema.validate(data);
};

/**
 * Validate bulk tag request (POST /api/v1/bulk/tag)
 * Adds or updates tags for multiple concepts
 */
const validateBulkTag = (data) => {
  const schema = Joi.object({
    conceptIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .max(500)
      .required(),
    tags: Joi.array()
      .items(Joi.string().max(50))
      .min(1)
      .max(20)
      .required()
      .messages({
        'array.min': 'At least one tag is required',
        'array.max': 'Cannot add more than 20 tags at once'
      })
  });

  return schema.validate(data);
};

module.exports = {
  validateBulkCreate,
  validateBulkArchive,
  validateBulkRestore,
  validateBulkDelete,
  validateBulkUpdateMetadata,
  validateBulkTag
};
