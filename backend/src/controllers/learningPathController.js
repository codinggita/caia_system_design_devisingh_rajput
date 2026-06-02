const Concept = require('../models/Concept');
const UserPreferences = require('../models/UserPreferences');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errorClass');

const buildLearningPathQuery = (prefs, profile) => {
  const query = { isArchived: false };
  const and = [];

  if (prefs?.interests?.length) {
    and.push({ 'metadata.technologies': { $in: prefs.interests } });
  }

  if (profile?.skills?.length) {
    and.push({ 'metadata.patterns_covered': { $in: profile.skills } });
  }

  if (profile?.goals) {
    and.push({ 'metadata.concept': new RegExp(profile.goals, 'i') });
  }

  if (and.length) {
    query.$and = and;
  }

  return query;
};

const getLearningPath = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const prefs = await UserPreferences.findOne({ user: userId }).lean();
  const profile = await require('../models/UserProfile').findOne({ user: userId }).lean();

  const query = buildLearningPathQuery(prefs, profile);
  const limit = parseInt(req.query.limit, 10) || 8;

  const path = await Concept.find(query)
    .sort({ 'metadata.difficulty': 1, createdAt: -1 })
    .limit(limit)
    .lean();

  return successResponse(res, 200, 'Learning path generated', path);
});

module.exports = {
  getLearningPath
};
