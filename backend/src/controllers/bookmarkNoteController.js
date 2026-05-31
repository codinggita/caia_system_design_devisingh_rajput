const Bookmark = require('../models/Bookmark');
const Concept = require('../models/Concept');
const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { ConflictError, NotFoundError } = require('../utils/errorClass');

const ensureConceptExists = async (conceptId) => {
  const concept = await Concept.findOne({ _id: conceptId, isArchived: false });
  if (!concept) {
    throw new NotFoundError('Concept not found');
  }
  return concept;
};

const getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('concept');

  return successResponse(res, 200, 'Bookmarks fetched successfully', bookmarks);
});

const addBookmark = asyncHandler(async (req, res) => {
  const conceptId = req.params.id;
  const userId = req.user.id;

  const concept = await ensureConceptExists(conceptId);
  const existing = await Bookmark.findOne({ concept: conceptId, user: userId });

  if (existing) {
    throw new ConflictError('Concept is already bookmarked');
  }

  await Bookmark.create({ concept: conceptId, user: userId });
  concept.bookmarksCount += 1;
  await concept.save();

  return successResponse(res, 201, 'Bookmark added successfully');
});

const removeBookmark = asyncHandler(async (req, res) => {
  const conceptId = req.params.id;
  const userId = req.user.id;

  const concept = await ensureConceptExists(conceptId);
  const deleted = await Bookmark.findOneAndDelete({ concept: conceptId, user: userId });

  if (!deleted) {
    throw new NotFoundError('Bookmark not found');
  }

  concept.bookmarksCount = Math.max(0, concept.bookmarksCount - 1);
  await concept.save();

  return successResponse(res, 200, 'Bookmark removed successfully');
});

const upsertNote = asyncHandler(async (req, res) => {
  const conceptId = req.params.id;
  const userId = req.user.id;

  await ensureConceptExists(conceptId);

  const note = await Note.findOneAndUpdate(
    { concept: conceptId, user: userId },
    { content: req.body.content },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return successResponse(res, 200, 'Note saved successfully', note);
});

const deleteNote = asyncHandler(async (req, res) => {
  const conceptId = req.params.id;
  const userId = req.user.id;

  const deleted = await Note.findOneAndDelete({ concept: conceptId, user: userId });

  if (!deleted) {
    throw new NotFoundError('Note not found');
  }

  return successResponse(res, 200, 'Note deleted successfully');
});

module.exports = {
  getMyBookmarks,
  addBookmark,
  removeBookmark,
  upsertNote,
  deleteNote
};
