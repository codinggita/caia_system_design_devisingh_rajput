/**
 * cache.js
 * -----
 * In-memory caching utility with TTL (time-to-live) support.
 * Used to cache frequently accessed data like trends, top concepts, and analytics.
 * For production, consider Redis integration.
 */

class Cache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  /**
   * Set a cache entry with optional TTL (in seconds)
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time-to-live in seconds (0 = no expiry)
   */
  set(key, value, ttl = 0) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store value
    this.store.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl * 1000 // Convert to milliseconds
    });

    // Set auto-expiry if TTL is specified
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  /**
   * Get a cache entry
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    if (!this.store.has(key)) {
      return null;
    }

    const entry = this.store.get(key);
    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if expired
    if (entry.ttl > 0 && age > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Check if a key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.store.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.store.forEach((_, key) => {
      this.delete(key);
    });
    this.store.clear();
    this.timers.clear();
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats (size, entries, memory estimate)
   */
  stats() {
    return {
      size: this.store.size,
      entries: Array.from(this.store.keys()),
      approximateMemoryMB: (JSON.stringify(Array.from(this.store.entries())).length / 1024 / 1024).toFixed(2)
    };
  }
}

// Singleton instance
const cache = new Cache();

/**
 * Cache middleware factory
 * Caches successful responses by key pattern
 * @param {string} keyPattern - Pattern to generate cache key (e.g., 'trends:{timeRange}')
 * @param {number} ttl - Time-to-live in seconds
 * @returns {function} Middleware function
 */
const cacheMiddleware = (keyPattern, ttl = 300) => {
  return (req, res, next) => {
    // Generate cache key from pattern
    const cacheKey = keyPattern.replace(/\{(\w+)\}/g, (match, param) => {
      return req.query[param] || req.params[param] || param;
    });

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        _cached: true,
        _cacheKey: cacheKey
      });
    }

    // Intercept res.json to cache successful responses
    const originalJson = res.json;
    res.json = function (data) {
      if (res.statusCode === 200 && data.success !== false) {
        cache.set(cacheKey, {
          ...data,
          _cached: false
        }, ttl);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  cache,
  cacheMiddleware
};
