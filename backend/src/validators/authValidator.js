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
  password: passwordSchema,
  role: Joi.string()
    .valid('user', 'admin')
    .default('user')
    .messages({
      'any.only': 'Role must be either "user" or "admin"'
    })
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
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Verification token is required'
    })
});

/**
 * Validation schema for profile update
 */
exports.updateProfileSchema = Joi.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional()
}).min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });
