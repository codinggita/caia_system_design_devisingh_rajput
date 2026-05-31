const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/response');

const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const limit = parseInt(req.query.limit, 10) || 20;
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(res, 200, 'Notifications fetched', notifications);
  } catch (err) {
    return next(err);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const payload = req.validated || req.body;
    const doc = await Notification.create({ ...payload, user: userId });
    return successResponse(res, 201, 'Notification created', doc);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUserNotifications,
  createNotification
};
