const UserProfile = require('../models/UserProfile');
const { successResponse, errorResponse } = require('../utils/response');

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const profile = await UserProfile.findOne({ user: userId }).lean();
    return successResponse(res, 200, 'Profile fetched', profile || {});
  } catch (err) {
    return next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const payload = req.validated || req.body;
    const profile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return successResponse(res, 200, 'Profile updated', profile);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
