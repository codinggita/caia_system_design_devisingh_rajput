const Joi = require('joi');

const progressSchema = Joi.object({
  completedConcepts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  streakDays: Joi.number().integer().min(0).optional(),
  currentLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  notes: Joi.string().max(1000).optional()
}).min(1);

const validateProgress = (req, res, next) => {
  const { error, value } = progressSchema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid progress payload', errors: error.details });
  }
  req.body = value;
  return next();
};

module.exports = {
  progressSchema,
  validateProgress
};
