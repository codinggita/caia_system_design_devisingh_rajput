const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

noteSchema.index({ concept: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
