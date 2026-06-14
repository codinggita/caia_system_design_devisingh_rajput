const UserAchievement = require('../models/UserAchievement');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errorClass');

const getUserAchievements = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const achievements = await UserAchievement.find({ user: userId }).lean();
  return successResponse(res, 200, 'Achievements fetched', achievements);
});

const createOrUpdateAchievement = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const payload = req.body;
  const achievement = await UserAchievement.findOneAndUpdate(
    { user: userId, title: payload.title },
    { $set: { ...payload, user: userId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return successResponse(res, 200, 'Achievement saved', achievement);
});

module.exports = {
  getUserAchievements,
  createOrUpdateAchievement
};
