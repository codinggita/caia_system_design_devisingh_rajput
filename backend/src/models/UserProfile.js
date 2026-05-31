const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    displayName: { type: String, trim: true },
    bio: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    skills: { type: [String], default: [] },
    goals: { type: String, trim: true },
    notificationPreferences: {
      weeklySummary: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      newRecommendations: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', UserProfileSchema);
