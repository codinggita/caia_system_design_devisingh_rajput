const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAchievementSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, default: 'skill' },
    status: { type: String, enum: ['locked', 'unlocked'], default: 'locked' },
    score: { type: Number, default: 0 },
    earnedAt: { type: Date }
  },
  { timestamps: true }
);

UserAchievementSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', UserAchievementSchema);
