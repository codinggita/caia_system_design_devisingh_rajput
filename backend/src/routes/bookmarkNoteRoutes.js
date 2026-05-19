const express = require('express');
const bookmarkNoteController = require('../controllers/bookmarkNoteController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { notesListQuerySchema, objectIdSchema } = require('../validators/commonValidator');
const { addNoteSchema } = require('../validators/conceptValidator');

const router = express.Router();

router.get('/bookmarks', protect, bookmarkNoteController.getMyBookmarks);
router.get('/notes', protect, validate(notesListQuerySchema, 'query'), bookmarkNoteController.getMyNotes);
router.get('/activity', protect, bookmarkNoteController.getMyActivitySummary);
router.post('/bookmarks/:id', protect, validate(objectIdSchema, 'params'), bookmarkNoteController.addBookmark);
router.delete('/bookmarks/:id', protect, validate(objectIdSchema, 'params'), bookmarkNoteController.removeBookmark);

router.put('/notes/:id', protect, validate(objectIdSchema, 'params'), validate(addNoteSchema), bookmarkNoteController.upsertNote);
router.delete('/notes/:id', protect, validate(objectIdSchema, 'params'), bookmarkNoteController.deleteNote);

module.exports = router;
