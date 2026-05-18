const Concept = require('../models/Concept');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { writeAuditLog } = require('../utils/auditLogger');

const bulkCreateConcepts = asyncHandler(async (req, res) => {
  const conceptsToInsert = req.body.concepts.map((concept) => ({
    ...concept,
    createdBy: req.user.id
  }));

  const inserted = await Concept.insertMany(conceptsToInsert, { ordered: false });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'concept.bulk_create',
    target: {
      resource: 'concept',
      id: null
    },
    details: {
      totalRequested: conceptsToInsert.length,
      totalCreated: inserted.length
    }
  });

  return successResponse(res, 201, 'Concepts created in bulk successfully', {
    totalRequested: conceptsToInsert.length,
    totalCreated: inserted.length
  });
});

const setArchiveState = async (conceptIds, isArchived) => {
  const result = await Concept.updateMany(
    { _id: { $in: conceptIds } },
    { $set: { isArchived } }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  };
};

const bulkArchiveConcepts = asyncHandler(async (req, res) => {
  const { conceptIds } = req.body;
  const result = await setArchiveState(conceptIds, true);

  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'concept.bulk_archive',
    target: {
      resource: 'concept',
      id: null
    },
    details: {
      ...result,
      conceptIds
    }
  });

  return successResponse(res, 200, 'Concepts archived in bulk successfully', result);
});

const bulkRestoreConcepts = asyncHandler(async (req, res) => {
  const { conceptIds } = req.body;
  const result = await setArchiveState(conceptIds, false);

  await writeAuditLog({
    req,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: 'concept.bulk_restore',
    target: {
      resource: 'concept',
      id: null
    },
    details: {
      ...result,
      conceptIds
    }
  });

  return successResponse(res, 200, 'Concepts restored in bulk successfully', result);
});

module.exports = {
  bulkCreateConcepts,
  bulkArchiveConcepts,
  bulkRestoreConcepts
};
