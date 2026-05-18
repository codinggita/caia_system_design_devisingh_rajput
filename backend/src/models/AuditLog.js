const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    actorRole: {
      type: String,
      enum: ['user', 'admin', 'system'],
      default: 'system'
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    target: {
      resource: {
        type: String,
        required: true,
        trim: true
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success'
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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

auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ 'target.resource': 1, 'target.id': 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
