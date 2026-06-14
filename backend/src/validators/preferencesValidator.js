const Joi = require('joi');

const preferencesSchema = Joi.object({
  preferences: Joi.object().optional(),
  interests: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().optional(),
  region: Joi.string().optional(),
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    push: Joi.boolean().optional()
  }).optional()
});

const validatePreferences = (req, res, next) => {
  const { error, value } = preferencesSchema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid preferences payload', errors: error.details });
  }
  req.body = value;
  return next();
};

module.exports = {
  preferencesSchema,
  validatePreferences
};
