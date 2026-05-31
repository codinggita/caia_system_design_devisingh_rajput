const AuditLog = require('../models/AuditLog');

const writeAuditLog = async ({
  req = null,
  actorId = null,
  actorRole = 'system',
  action,
  target,
  status = 'success',
  details = {}
}) => {
  if (!action || !target || !target.resource) {
    return null;
  }

  try {
    return await AuditLog.create({
      actor: actorId,
      actorRole,
      action,
      target,
      status,
      details,
      ipAddress: req ? req.ip : null,
      userAgent: req ? req.get('user-agent') : null
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[audit-log] Failed to persist audit log:', error.message);
    }
    return null;
  }
};

module.exports = {
  writeAuditLog
};
