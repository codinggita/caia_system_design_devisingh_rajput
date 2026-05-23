const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    completedConcepts: [{ type: Schema.Types.ObjectId, ref: 'Concept' }],
    completedAt: [{ type: Date }],
    streakDays: { type: Number, default: 0 },
    currentLevel: { type: String, default: 'beginner' },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProgress', UserProgressSchema);
