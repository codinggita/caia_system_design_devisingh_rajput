const Joi = require('joi');

const achievementSchema = Joi.object({
  title: Joi.string().max(120).required(),
  description: Joi.string().max(500).optional(),
  type: Joi.string().valid('skill', 'milestone', 'challenge').optional(),
  status: Joi.string().valid('locked', 'unlocked').optional(),
  score: Joi.number().integer().min(0).optional(),
  earnedAt: Joi.date().optional()
});

const validateAchievement = (req, res, next) => {
  const { error, value } = achievementSchema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid achievement payload', errors: error.details });
  }
  req.validated = value;
  return next();
};

module.exports = {
  validateAchievement
};
