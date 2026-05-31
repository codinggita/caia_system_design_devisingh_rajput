const os = require('os');
const mongoose = require('mongoose');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const dbStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

const ping = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'pong', {
    timestamp: new Date().toISOString()
  });
});

const readiness = asyncHandler(async (req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbState = dbStateMap[readyState] || 'unknown';
  const isReady = readyState === 1;

  return successResponse(
    res,
    isReady ? 200 : 503,
    isReady ? 'Service is ready' : 'Service is not ready',
    {
      database: {
        state: dbState
      },
      uptimeSeconds: Number(process.uptime().toFixed(2))
    }
  );
});

const info = asyncHandler(async (req, res) => {
  const baseData = {
    environment: env.NODE_ENV,
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    nodeVersion: process.version,
    pid: process.pid,
    platform: process.platform,
    cpuCount: os.cpus().length,
    loadAverage: os.loadavg(),
    database: {
      state: dbStateMap[mongoose.connection.readyState] || 'unknown'
    },
    featureFlags: {
      enableAnalytics: env.ENABLE_ANALYTICS,
      enableSystemRoutes: env.ENABLE_SYSTEM_ROUTES
    }
  };

  if (env.SYSTEM_INFO_INCLUDE_MEMORY) {
    baseData.memory = process.memoryUsage();
  }

  return successResponse(res, 200, 'System info fetched successfully', baseData);
});

module.exports = {
  ping,
  readiness,
  info
};
