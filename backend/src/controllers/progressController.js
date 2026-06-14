const UserProgress = require('../models/UserProgress');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errorClass');

const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const progress = await UserProgress.findOne({ user: userId }).lean();
  return successResponse(res, 200, 'Progress fetched', progress || {});
});

const updateUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const payload = req.body;
  const progress = await UserProgress.findOneAndUpdate(
    { user: userId },
    { $set: payload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return successResponse(res, 200, 'Progress updated', progress);
});

module.exports = {
  getUserProgress,
  updateUserProgress
};
