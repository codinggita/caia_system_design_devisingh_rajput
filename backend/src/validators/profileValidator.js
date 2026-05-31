const Joi = require('joi');

const profileSchema = Joi.object({
  displayName: Joi.string().max(60).optional(),
  bio: Joi.string().max(500).optional(),
  avatarUrl: Joi.string().uri().optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  goals: Joi.string().max(250).optional(),
  notificationPreferences: Joi.object({
    weeklySummary: Joi.boolean().optional(),
    mentions: Joi.boolean().optional(),
    newRecommendations: Joi.boolean().optional()
  }).optional()
}).min(1);

const validateProfile = (req, res, next) => {
  const { error, value } = profileSchema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid profile payload', errors: error.details });
  }
  req.validated = value;
  return next();
};

module.exports = {
  validateProfile
};
