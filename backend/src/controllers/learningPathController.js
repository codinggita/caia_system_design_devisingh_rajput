const Concept = require('../models/Concept');
const UserPreferences = require('../models/UserPreferences');
const { successResponse, errorResponse } = require('../utils/response');

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

const getLearningPath = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return errorResponse(res, 401, 'Unauthorized');

    const prefs = await UserPreferences.findOne({ user: userId }).lean();
    const profile = await require('../models/UserProfile').findOne({ user: userId }).lean();

    const query = buildLearningPathQuery(prefs, profile);
    const limit = parseInt(req.query.limit, 10) || 8;

    const path = await Concept.find(query)
      .sort({ 'metadata.difficulty': 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(res, 200, 'Learning path generated', path);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getLearningPath
};
