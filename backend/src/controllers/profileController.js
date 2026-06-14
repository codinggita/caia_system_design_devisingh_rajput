const UserProfile = require('../models/UserProfile');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errorClass');

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const profile = await UserProfile.findOne({ user: userId }).lean();
  return successResponse(res, 200, 'Profile fetched', profile || {});
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const payload = req.body;
  const profile = await UserProfile.findOneAndUpdate(
    { user: userId },
    { $set: payload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return successResponse(res, 200, 'Profile updated', profile);
});

module.exports = {
  getUserProfile,
  updateUserProfile
};
