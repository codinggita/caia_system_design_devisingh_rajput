const express = require('express');
const mongoose = require('mongoose');
const { successResponse } = require('../utils/response');

const router = express.Router();

const dbStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

router.get('/', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbState = dbStateMap[readyState] || 'unknown';
  const isHealthy = readyState === 1;

  return successResponse(
    res,
    isHealthy ? 200 : 503,
    isHealthy ? 'Service is healthy' : 'Service is degraded',
    {
      uptimeSeconds: Number(process.uptime().toFixed(2)),
      timestamp: new Date().toISOString(),
      database: {
        state: dbState
      }
    }
  );
});

module.exports = router;
