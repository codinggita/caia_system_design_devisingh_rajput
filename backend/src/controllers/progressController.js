const UserProgress = require('../models/UserProgress');
const { successResponse, errorResponse } = require('../utils/response');

const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const progress = await UserProgress.findOne({ user: userId }).lean();
    return successResponse(res, 200, 'Progress fetched', progress || {});
  } catch (err) {
    return next(err);
  }
};

const updateUserProgress = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const payload = req.validated || req.body;
    const progress = await UserProgress.findOneAndUpdate(
      { user: userId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return successResponse(res, 200, 'Progress updated', progress);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUserProgress,
  updateUserProgress
};
