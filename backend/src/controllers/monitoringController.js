const { getPerformanceStats, performanceMetrics } = require('../middlewares/performance');
const { successResponse } = require('../utils/response');

/**
 * monitoringController.js
 * -----
 * System monitoring and health diagnostics endpoints.
 * Provides performance metrics, cache stats, and system health checks.
 */

/**
 * @desc    Get system performance metrics
 * @route   GET /api/v1/monitoring/performance
 * @access  Admin only
 */
exports.getPerformanceMetrics = async (req, res, next) => {
  try {
    const stats = getPerformanceStats();
    return successResponse(res, 200, 'Performance metrics retrieved', stats);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get system health status
 * @route   GET /api/v1/monitoring/health
 * @access  Public (basic) / Admin (detailed)
 */
exports.getHealthStatus = async (req, res, next) => {
  try {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const cpuUsage = process.cpuUsage();

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date(),
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime)
      },
      memory: {
        heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
        external: (memoryUsage.external / 1024 / 1024).toFixed(2),
        unit: 'MB'
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
        unit: 'microseconds'
      },
      checks: {
        memoryHealthy: memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9,
        uptimeHealthy: uptime > 60,
        requestMetricsAvailable: performanceMetrics.requests.length > 0
      }
    };

    // Determine overall status
    if (!healthStatus.checks.memoryHealthy) {
      healthStatus.status = 'degraded';
      healthStatus.warnings = ['Memory usage above 90%'];
    }

    return successResponse(res, 200, 'System health status', healthStatus);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get database connection status
 * @route   GET /api/v1/monitoring/database
 * @access  Admin only
 */
exports.getDatabaseStatus = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const connection = mongoose.connection;

    const dbStatus = {
      connected: connection.readyState === 1,
      readyState: connection.readyState,
      readyStateDescription: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[connection.readyState],
      database: connection.name || 'unknown',
      host: connection.host || 'unknown',
      port: connection.port || 'unknown'
    };

    const statusCode = dbStatus.connected ? 200 : 503;
    return successResponse(res, statusCode, 'Database status', dbStatus);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get slow queries/requests report
 * @route   GET /api/v1/monitoring/slow-requests
 * @access  Admin only
 */
exports.getSlowRequests = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || performanceMetrics.slowThreshold;
    const slowRequests = performanceMetrics.requests.filter(r => r.duration > threshold);

    const report = {
      slowThreshold: threshold,
      unit: 'milliseconds',
      totalSlowRequests: slowRequests.length,
      slowestRequests: slowRequests
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10)
        .map(r => ({
          path: r.path,
          method: r.method,
          duration: r.duration,
          statusCode: r.statusCode,
          timestamp: r.timestamp
        }))
    };

    return successResponse(res, 200, 'Slow requests report', report);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get cache statistics
 * @route   GET /api/v1/monitoring/cache
 * @access  Admin only
 */
exports.getCacheStats = async (req, res, next) => {
  try {
    const { cache } = require('../utils/cache');
    const stats = cache.stats();

    return successResponse(res, 200, 'Cache statistics', {
      ...stats,
      timestamp: new Date()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get API usage statistics
 * @route   GET /api/v1/monitoring/usage
 * @access  Admin only
 */
exports.getApiUsageStats = async (req, res, next) => {
  try {
    const timeRange = req.query.timeRange || '1h';
    const requests = performanceMetrics.requests;

    // Filter requests by time range
    let filteredRequests = requests;
    if (timeRange === '1h') {
      filteredRequests = requests.filter(r => Date.now() - r.timestamp < 3600000);
    } else if (timeRange === '24h') {
      filteredRequests = requests.filter(r => Date.now() - r.timestamp < 86400000);
    }

    const usageStats = {
      timeRange,
      totalRequests: filteredRequests.length,
      byMethod: groupByMethod(filteredRequests),
      byStatusCode: groupByStatusCode(filteredRequests),
      errorRate: calculateErrorRate(filteredRequests),
      averageResponseTime: calculateAverageResponseTime(filteredRequests),
      topPaths: getTopPaths(filteredRequests, 10)
    };

    return successResponse(res, 200, 'API usage statistics', usageStats);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    System diagnostic report
 * @route   GET /api/v1/monitoring/diagnostics
 * @access  Admin only
 */
exports.getDiagnosticsReport = async (req, res, next) => {
  try {
    const memoryUsage = process.memoryUsage();
    const performanceStats = getPerformanceStats();
    const { cache } = require('../utils/cache');
    const cacheStats = cache.stats();

    const report = {
      generatedAt: new Date(),
      system: {
        uptime: process.uptime(),
        memory: {
          heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
          heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
          unit: 'MB'
        },
        nodeVersion: process.version
      },
      api: {
        totalRequests: performanceStats.totalRequests,
        averageResponseTime: performanceStats.requestDuration.avg,
        slowRequests: performanceStats.slowRequests,
        errorRequests: performanceMetrics.requests.filter(r => r.statusCode >= 400).length
      },
      cache: {
        size: cacheStats.size,
        approximateMemory: cacheStats.approximateMemoryMB
      },
      recommendations: generateRecommendations(performanceStats, cacheStats, memoryUsage)
    };

    return successResponse(res, 200, 'Diagnostics report', report);
  } catch (err) {
    next(err);
  }
};

// --------- Helper Functions ---------

/**
 * Format uptime into human-readable format
 */
const formatUptime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
};

/**
 * Group requests by HTTP method
 */
const groupByMethod = (requests) => {
  const grouped = {};
  requests.forEach(r => {
    grouped[r.method] = (grouped[r.method] || 0) + 1;
  });
  return grouped;
};

/**
 * Group requests by status code
 */
const groupByStatusCode = (requests) => {
  const grouped = {};
  requests.forEach(r => {
    const code = r.statusCode;
    grouped[code] = (grouped[code] || 0) + 1;
  });
  return grouped;
};

/**
 * Calculate error rate
 */
const calculateErrorRate = (requests) => {
  if (requests.length === 0) {
    return 0;
  }
  const errors = requests.filter(r => r.statusCode >= 400).length;
  return ((errors / requests.length) * 100).toFixed(2);
};

/**
 * Calculate average response time
 */
const calculateAverageResponseTime = (requests) => {
  if (requests.length === 0) {
    return 0;
  }
  const total = requests.reduce((sum, r) => sum + r.duration, 0);
  return (total / requests.length).toFixed(2);
};

/**
 * Get top paths by request count
 */
const getTopPaths = (requests, limit = 10) => {
  const pathCounts = {};
  requests.forEach(r => {
    pathCounts[r.path] = (pathCounts[r.path] || 0) + 1;
  });

  return Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([path, count]) => ({ path, count }));
};

/**
 * Generate recommendations based on metrics
 */
const generateRecommendations = (perfStats, cacheStats, memUsage) => {
  const recommendations = [];

  // Memory recommendations
  const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  if (heapUsagePercent > 80) {
    recommendations.push('High memory usage detected. Consider optimizing queries or increasing heap size.');
  }

  // Performance recommendations
  if (perfStats.slowRequests > perfStats.totalRequests * 0.1) {
    recommendations.push('More than 10% of requests are slow. Review slow queries and add caching.');
  }

  // Cache recommendations
  if (cacheStats.size < 5) {
    recommendations.push('Low cache utilization. Consider increasing cache TTL for frequently accessed data.');
  }

  if (recommendations.length === 0) {
    recommendations.push('System is operating normally.');
  }

  return recommendations;
};

module.exports = exports;
