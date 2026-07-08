const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError, NotFoundError } = require('../utils/errorClass');

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

const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  return successResponse(res, 200, 'Notification marked as read', notification);
});

const markAllRead = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true } }
  );

  return successResponse(res, 200, 'All notifications marked as read');
});

module.exports = {
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllRead
};
