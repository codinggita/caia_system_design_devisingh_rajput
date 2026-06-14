const Joi = require('joi');

// Common validation patterns
const passwordSchema = Joi.string()
  .min(6)
  .max(30)
  .required()
  .messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must not exceed 30 characters'
  });

const emailSchema = Joi.string()
  .email()
  .lowercase()
  .trim()
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  });

const usernameSchema = Joi.string()
  .alphanum()
  .min(3)
  .max(20)
  .required()
  .messages({
    'string.alphanum': 'Username can only contain letters and numbers',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must not exceed 20 characters',
    'string.empty': 'Username is required'
  });

// Authentication Validators

/**
 * Validation schema for user registration
 */
exports.registerSchema = Joi.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema
});

/**
 * Validation schema for user login
 */
exports.loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

/**
 * Validation schema for token refresh
 */
exports.refreshTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Token is required'
    })
});

/**
 * Validation schema for forgot password
 */
exports.forgotPasswordSchema = Joi.object({
  email: emailSchema
});

/**
 * Validation schema for reset password
 */
exports.resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Reset token is required'
    }),
  newPassword: passwordSchema
});

/**
 * Validation schema for email verification
 */
exports.verifyEmailSchema = Joi.object({
  email: emailSchema,
  code: Joi.string()
    .required()
    .messages({
      'string.empty': 'Verification code is required'
    })
});

/**
 * Validation schema for profile update
 */
exports.updateProfileSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .optional(),
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .optional(),
  password: Joi.string()
    .min(6)
    .max(30)
    .optional()
}).min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });
