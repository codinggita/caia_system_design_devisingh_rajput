const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errorClass');

const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const limit = parseInt(req.query.limit, 10) || 20;
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return successResponse(res, 200, 'Notifications fetched', notifications);
});

const createNotification = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const payload = req.body;
  const doc = await Notification.create({ ...payload, user: userId });
  return successResponse(res, 201, 'Notification created', doc);
});

module.exports = {
  getUserNotifications,
  createNotification
};
