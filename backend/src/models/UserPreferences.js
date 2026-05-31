const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserPreferencesSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferences: { type: Schema.Types.Mixed, default: {} },
    interests: [{ type: String }],
    language: { type: String, default: 'en' },
    region: { type: String },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
