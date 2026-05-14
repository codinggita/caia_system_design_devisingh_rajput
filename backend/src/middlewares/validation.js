const { errorResponse } = require('../utils/response');

/**
 * Middleware factory for request validation using Joi schemas
 * @param {Joi.Schema} schema - The Joi validation schema
 * @param {string} property - The property to validate (body, params, query)
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      // Format validation errors
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return errorResponse(res, 400, 'Validation failed', errors);
    }

    // Replace request property with validated data
    req[property] = value;
    next();
  };
};

/**
 * Middleware factory for validating multiple properties
 * @param {Object} schemas - Object with keys 'body', 'params', 'query' and Joi schemas
 * @returns {Function} Express middleware
 */
const validateRequest = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate each property
    for (const [property, schema] of Object.entries(schemas)) {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            property,
            field: detail.path.join('.'),
            message: detail.message
          });
        });
      } else {
        req[property] = value;
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 400, 'Validation failed', errors);
    }

    next();
  };
};

module.exports = {
  validate,
  validateRequest
};
