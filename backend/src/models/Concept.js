const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      required: true,
      trim: true
    },
    concept: {
      type: String,
      required: true,
      trim: true
    },
    question_type: {
      type: String,
      default: 'open-ended'
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    languages: {
      type: [String],
      default: []
    },
    cloud_platforms: {
      type: [String],
      default: []
    },
    technologies: {
      type: [String],
      default: []
    },
    patterns_covered: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const conceptSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true
    },
    response: {
      type: String,
      required: true,
      trim: true
    },
    metadata: {
      type: metadataSchema,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    votesCount: {
      up: { type: Number, default: 0 },
      down: { type: Number, default: 0 }
    },
    bookmarksCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

conceptSchema.index({ prompt: 'text', response: 'text', 'metadata.concept': 'text' });
conceptSchema.index({ 'metadata.category': 1, 'metadata.difficulty': 1, createdAt: -1 });

module.exports = mongoose.model('Concept', conceptSchema);
