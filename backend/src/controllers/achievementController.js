const UserAchievement = require('../models/UserAchievement');
const { successResponse, errorResponse } = require('../utils/response');

const getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const achievements = await UserAchievement.find({ user: userId }).lean();
    return successResponse(res, 200, 'Achievements fetched', achievements);
  } catch (err) {
    return next(err);
  }
};

const createOrUpdateAchievement = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const payload = req.validated || req.body;
    const achievement = await UserAchievement.findOneAndUpdate(
      { user: userId, title: payload.title },
      { $set: { ...payload, user: userId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return successResponse(res, 200, 'Achievement saved', achievement);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUserAchievements,
  createOrUpdateAchievement
};
