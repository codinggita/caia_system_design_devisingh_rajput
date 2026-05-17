const Concept = require('../models/Concept');
const Vote = require('../models/Vote');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { NotFoundError } = require('../utils/errorClass');

const ensureConcept = async (conceptId) => {
  const concept = await Concept.findOne({ _id: conceptId, isArchived: false });

  if (!concept) {
    throw new NotFoundError('Concept not found');
  }

  return concept;
};

const applyVoteCounts = (concept, fromVoteType, toVoteType) => {
  if (fromVoteType && concept.votesCount[fromVoteType] > 0) {
    concept.votesCount[fromVoteType] -= 1;
  }

  if (toVoteType) {
    concept.votesCount[toVoteType] += 1;
  }
};

const upsertVote = asyncHandler(async (req, res) => {
  const conceptId = req.params.id;
  const userId = req.user.id;
  const { voteType } = req.body;

  const concept = await ensureConcept(conceptId);
  const existingVote = await Vote.findOne({ concept: conceptId, user: userId });

  if (existingVote && existingVote.voteType === voteType) {
    return successResponse(res, 200, 'Vote already recorded', {
      voteType,
      votesCount: concept.votesCount
    });
  }

  if (existingVote) {
    applyVoteCounts(concept, existingVote.voteType, voteType);
    existingVote.voteType = voteType;
    await existingVote.save();
  } else {
    applyVoteCounts(concept, null, voteType);
    await Vote.create({ concept: conceptId, user: userId, voteType });
  }

  await concept.save();

  return successResponse(res, 200, 'Vote saved successfully', {
    voteType,
    votesCount: concept.votesCount
  });
});

const removeVote = asyncHandler(async (req, res) => {
  const conceptId = req.params.id;
  const userId = req.user.id;

  const concept = await ensureConcept(conceptId);
  const existingVote = await Vote.findOneAndDelete({ concept: conceptId, user: userId });

  if (!existingVote) {
    throw new NotFoundError('Vote not found');
  }

  applyVoteCounts(concept, existingVote.voteType, null);
  await concept.save();

  return successResponse(res, 200, 'Vote removed successfully', {
    votesCount: concept.votesCount
  });
});

module.exports = {
  upsertVote,
  removeVote
};
