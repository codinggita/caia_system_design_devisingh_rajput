const Concept = require('../models/Concept');
const UserPreferences = require('../models/UserPreferences');
const { successResponse, errorResponse } = require('../utils/response');

const buildQueryFromPreferences = (prefs) => {
  const query = { isArchived: false };
  const or = [];

  if (!prefs) return query;

  if (prefs.interests && prefs.interests.length) {
    or.push({ 'metadata.technologies': { $in: prefs.interests } });
    or.push({ 'metadata.patterns_covered': { $in: prefs.interests } });
    or.push({ 'metadata.concept': { $in: prefs.interests } });
  }
  if (prefs.language) {
    or.push({ 'metadata.languages': prefs.language });
  }
  if (prefs.region) {
    // regions are not directly mapped; match a concept tag or skip
  }

  if (or.length) query.$or = or;
  return query;
};

const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    let prefs = null;
    if (userId) prefs = await UserPreferences.findOne({ user: userId }).lean();

    const { limit = 10 } = req.query;

    const query = buildQueryFromPreferences(prefs);

    // simple score: bookmarksCount + (up - down)
    const docs = await Concept.find(query)
      .sort({ 'bookmarksCount': -1, 'votesCount.up': -1, createdAt: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    return successResponse(res, 200, 'Recommendations', docs);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getRecommendations
};
