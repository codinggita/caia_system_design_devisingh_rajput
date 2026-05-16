const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
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
    voteType: {
      type: String,
      enum: ['up', 'down'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

voteSchema.index({ concept: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
