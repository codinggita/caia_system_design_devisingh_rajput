const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    concept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Concept',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

bookmarkSchema.index({ concept: 1, user: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
