const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    normalizedQuery: {
      type: String,
      trim: true,
      maxlength: 500
    },
    resultCount: {
      type: Number,
      default: 0,
      min: 0
    },
    page: {
      type: Number,
      default: 1,
      min: 1
    },
    limit: {
      type: Number,
      default: 20,
      min: 1
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    latencyMs: {
      type: Number,
      default: 0,
      min: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

searchLogSchema.index({ createdAt: -1 });
searchLogSchema.index({ query: 1, createdAt: -1 });
searchLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SearchLog', searchLogSchema);
