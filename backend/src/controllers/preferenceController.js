const UserPreferences = require('../models/UserPreferences');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errorClass');

const getUserPreferences = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const prefs = await UserPreferences.findOne({ user: userId }).lean();
  return successResponse(res, 200, 'Preferences fetched', prefs || {});
});

const updateUserPreferences = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const payload = req.body;

  const prefs = await UserPreferences.findOneAndUpdate(
    { user: userId },
    { $set: payload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return successResponse(res, 200, 'Preferences updated', prefs);
});

module.exports = {
  getUserPreferences,
  updateUserPreferences
};
