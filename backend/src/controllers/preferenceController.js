const UserPreferences = require('../models/UserPreferences');
const { successResponse, errorResponse } = require('../utils/response');

const getUserPreferences = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const prefs = await UserPreferences.findOne({ user: userId }).lean();
    return successResponse(res, 200, 'Preferences fetched', prefs || {});
  } catch (err) {
    return next(err);
  }
};

const updateUserPreferences = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const payload = req.validated || req.body;

    const prefs = await UserPreferences.findOneAndUpdate(
      { user: userId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return successResponse(res, 200, 'Preferences updated', prefs);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUserPreferences,
  updateUserPreferences
};
