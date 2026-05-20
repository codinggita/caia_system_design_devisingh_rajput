/**
 * performance.js
 * -----
 * Performance monitoring middleware for tracking request/response metrics.
 * Collects timing data, memory usage, and slow query detection.
 */

const performanceMetrics = {
  requests: [],
  slowThreshold: 1000 // milliseconds
};

/**
 * Performance monitoring middleware
 * Tracks request timing, memory usage, and logs slow requests
 */
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();

  // Intercept res.send/json to capture end of request
  const originalSend = res.send;
  const originalJson = res.json;

  const captureMetrics = (data) => {
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = endTime - startTime;

    const metric = {
      timestamp: new Date(startTime),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      memoryDelta: {
        heapUsed: (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024, // MB
        heapTotal: (endMemory.heapTotal - startMemory.heapTotal) / 1024 / 1024,
        external: (endMemory.external - startMemory.external) / 1024 / 1024
      },
      queryCount: req.queryCount || 0,
      userId: req.user?.id || 'anonymous'
    };

    performanceMetrics.requests.push(metric);

    // Keep only last 1000 requests
    if (performanceMetrics.requests.length > 1000) {
      performanceMetrics.requests.shift();
    }

    // Log slow requests
    if (duration > performanceMetrics.slowThreshold) {
      console.warn(`[SLOW REQUEST] ${req.method} ${req.path} took ${duration}ms`);
      console.warn(`Memory delta (heap): ${metric.memoryDelta.heapUsed.toFixed(2)} MB`);
    }

    // Attach metrics to response
    res.set('X-Response-Time', `${duration}ms`);
    res.set('X-Memory-Delta', `${metric.memoryDelta.heapUsed.toFixed(2)}MB`);

    return data;
  };

  res.send = function (data) {
    captureMetrics(data);
    return originalSend.call(this, data);
  };

  res.json = function (data) {
    captureMetrics(data);
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Get performance statistics
 * @returns {object} Aggregated performance metrics
 */
const getPerformanceStats = () => {
  if (performanceMetrics.requests.length === 0) {
    return { message: 'No metrics collected yet' };
  }

  const requests = performanceMetrics.requests;
  const durations = requests.map(r => r.duration);
  const memoryDeltas = requests.map(r => r.memoryDelta.heapUsed);

  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const max = arr => Math.max(...arr);
  const min = arr => Math.min(...arr);

  return {
    totalRequests: requests.length,
    requestDuration: {
      avg: avg(durations).toFixed(2),
      min: min(durations),
      max: max(durations),
      unit: 'ms'
    },
    memoryImpact: {
      avg: avg(memoryDeltas).toFixed(2),
      min: min(memoryDeltas).toFixed(2),
      max: max(memoryDeltas).toFixed(2),
      unit: 'MB'
    },
    byPath: getPathBreakdown(requests),
    slowRequests: requests.filter(r => r.duration > performanceMetrics.slowThreshold).length,
    slowThreshold: performanceMetrics.slowThreshold
  };
};

/**
 * Get performance metrics grouped by path
 * @param {array} requests - Array of request metrics
 * @returns {object} Metrics grouped by path
 */
const getPathBreakdown = (requests) => {
  const breakdown = {};

  requests.forEach(req => {
    if (!breakdown[req.path]) {
      breakdown[req.path] = {
        count: 0,
        durations: [],
        errors: 0
      };
    }
    breakdown[req.path].count++;
    breakdown[req.path].durations.push(req.duration);
    if (req.statusCode >= 400) breakdown[req.path].errors++;
  });

  // Calculate averages
  Object.keys(breakdown).forEach(path => {
    const durations = breakdown[path].durations;
    breakdown[path].avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2);
    breakdown[path].maxDuration = Math.max(...durations);
    delete breakdown[path].durations; // Remove raw data
  });

  return breakdown;
};

/**
 * Clear performance metrics
 */
const clearPerformanceMetrics = () => {
  performanceMetrics.requests = [];
};

/**
 * Query counter middleware
 * Counts database queries per request
 */
const queryCounter = (req, res, next) => {
  req.queryCount = 0;
  next();
};

/**
 * Increment query counter
 * @param {object} req - Express request object
 */
const incrementQueryCount = (req) => {
  if (req && typeof req.queryCount === 'number') {
    req.queryCount++;
  }
};

module.exports = {
  performanceMonitor,
  getPerformanceStats,
  getPathBreakdown,
  clearPerformanceMetrics,
  queryCounter,
  incrementQueryCount,
  performanceMetrics
};
