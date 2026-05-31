const Joi = require('joi');

const notificationSchema = Joi.object({
  title: Joi.string().max(150).required(),
  message: Joi.string().max(2000).required(),
  channel: Joi.string().valid('email', 'push', 'in-app').optional(),
  meta: Joi.object().optional()
});

const validateNotification = (req, res, next) => {
  const { error, value } = notificationSchema.validate(req.body, { stripUnknown: true });
  if (error) return res.status(400).json({ success: false, message: 'Invalid notification payload', errors: error.details });
  req.validated = value;
  return next();
};

module.exports = {
  validateNotification
};
