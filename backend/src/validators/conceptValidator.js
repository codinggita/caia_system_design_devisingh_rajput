const Joi = require('joi');

// Metadata validation schema
const metadataSchema = Joi.object({
  category: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category is required'
    }),
  subcategory: Joi.string()
    .required()
    .messages({
      'string.empty': 'Subcategory is required'
    }),
  concept: Joi.string()
    .required()
    .messages({
      'string.empty': 'Concept name is required'
    }),
  question_type: Joi.string()
    .optional(),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .default('intermediate'),
  languages: Joi.array()
    .items(Joi.string())
    .default([]),
  cloud_platforms: Joi.array()
    .items(Joi.string())
    .default([]),
  technologies: Joi.array()
    .items(Joi.string())
    .default([]),
  patterns_covered: Joi.array()
    .items(Joi.string())
    .default([])
});

/**
 * Validation schema for creating a concept
 */
exports.createConceptSchema = Joi.object({
  prompt: Joi.string()
    .required()
    .min(10)
    .max(1000)
    .messages({
      'string.empty': 'Prompt is required',
      'string.min': 'Prompt must be at least 10 characters',
      'string.max': 'Prompt must not exceed 1000 characters'
    }),
  response: Joi.string()
    .required()
    .min(20)
    .max(10000)
    .messages({
      'string.empty': 'Response is required',
      'string.min': 'Response must be at least 20 characters',
      'string.max': 'Response must not exceed 10000 characters'
    }),
  metadata: metadataSchema.required()
});

/**
 * Validation schema for updating a concept
 */
exports.updateConceptSchema = Joi.object({
  prompt: Joi.string()
    .optional()
    .min(10)
    .max(1000),
  response: Joi.string()
    .optional()
    .min(20)
    .max(10000),
  metadata: metadataSchema.optional(),
  isArchived: Joi.boolean()
    .optional()
}).min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });

/**
 * Validation schema for adding a note
 */
exports.addNoteSchema = Joi.object({
  content: Joi.string()
    .required()
    .min(1)
    .max(2000)
    .messages({
      'string.empty': 'Note content is required',
      'string.max': 'Note content must not exceed 2000 characters'
    })
});

/**
 * Validation schema for updating a note
 */
exports.updateNoteSchema = Joi.object({
  content: Joi.string()
    .required()
    .min(1)
    .max(2000)
    .messages({
      'string.empty': 'Note content is required',
      'string.max': 'Note content must not exceed 2000 characters'
    })
});

/**
 * Validation schema for bulk concept creation
 */
exports.bulkCreateConceptsSchema = Joi.object({
  concepts: Joi.array()
    .items(
      Joi.object({
        prompt: Joi.string()
          .required()
          .min(10)
          .max(1000),
        response: Joi.string()
          .required()
          .min(20)
          .max(10000),
        metadata: metadataSchema.required()
      })
    )
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one concept must be provided',
      'array.max': 'Maximum 100 concepts can be created at once'
    })
});

/**
 * Validation schema for archiving concepts
 */
exports.archiveConceptsSchema = Joi.object({
  conceptIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one concept ID must be provided'
    })
});
