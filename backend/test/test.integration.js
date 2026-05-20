const { expect } = require('chai');
const request = require('supertest');

describe('Day 20 Integration Tests', () => {
  // ===== Search Validator Tests =====
  describe('Search Validators', () => {
    const {
      validateGlobalSearch,
      validateAdvancedSearch,
      validateSearchSuggestions,
      validateSearchTrends
    } = require('../src/validators/searchValidator');

    it('should validate global search with required query', () => {
      const { error, value } = validateGlobalSearch({ q: 'javascript' });
      expect(error).to.be.undefined;
      expect(value).to.include({ q: 'javascript' });
    });

    it('should fail without search query', () => {
      const { error } = validateGlobalSearch({});
      expect(error).to.exist;
      expect(error.message).to.include('required');
    });

    it('should validate advanced search with filters', () => {
      const { error, value } = validateAdvancedSearch({
        q: 'design patterns',
        category: 'architecture',
        difficulty: 'advanced',
        sortBy: 'relevance'
      });
      expect(error).to.be.undefined;
      expect(value.difficulty).to.equal('advanced');
    });

    it('should validate search suggestions', () => {
      const { error, value } = validateSearchSuggestions({ q: 'java' });
      expect(error).to.be.undefined;
      expect(value.limit).to.equal(10); // Default
    });

    it('should validate search trends request', () => {
      const { error, value } = validateSearchTrends({
        timeRange: '7d',
        limit: 15
      });
      expect(error).to.be.undefined;
      expect(value.timeRange).to.equal('7d');
    });
  });

  // ===== Filter Validator Tests =====
  describe('Filter Validators', () => {
    const {
      validateFilterByCategory,
      validateFilterByDifficulty,
      validateCombinedFilter
    } = require('../src/validators/filterValidator');

    it('should validate filter by category', () => {
      const { error, value } = validateFilterByCategory({ name: 'Web Development' });
      expect(error).to.be.undefined;
      expect(value.name).to.equal('Web Development');
    });

    it('should validate filter by difficulty', () => {
      const { error, value } = validateFilterByDifficulty({ level: 'intermediate' });
      expect(error).to.be.undefined;
      expect(value.level).to.equal('intermediate');
    });

    it('should reject invalid difficulty level', () => {
      const { error } = validateFilterByDifficulty({ level: 'expert' });
      expect(error).to.exist;
    });

    it('should validate combined filter', () => {
      const { error, value } = validateCombinedFilter({
        category: 'Backend',
        difficulty: 'advanced',
        minVotes: 5
      });
      expect(error).to.be.undefined;
      expect(value.category).to.equal('Backend');
    });

    it('should require at least one filter in combined filter', () => {
      const { error } = validateCombinedFilter({});
      expect(error).to.exist;
    });
  });

  // ===== Analytics Validator Tests =====
  describe('Analytics Validators', () => {
    const {
      validateGetTrends,
      validateGetTopConcepts,
      validateGetDashboardSummary
    } = require('../src/validators/analyticsValidator');

    it('should validate trends request', () => {
      const { error, value } = validateGetTrends({
        timeRange: '30d',
        metric: 'views'
      });
      expect(error).to.be.undefined;
      expect(value.metric).to.equal('views');
    });

    it('should validate top concepts request', () => {
      const { error, value } = validateGetTopConcepts({
        sortBy: 'votes',
        timeRange: '7d',
        limit: 15
      });
      expect(error).to.be.undefined;
      expect(value.limit).to.equal(15);
    });

    it('should validate dashboard summary', () => {
      const { error, value } = validateGetDashboardSummary({
        timeRange: '30d'
      });
      expect(error).to.be.undefined;
      expect(value.timeRange).to.equal('30d');
    });
  });

  // ===== Bulk Validator Tests =====
  describe('Bulk Validators', () => {
    const {
      validateBulkCreate,
      validateBulkArchive,
      validateBulkDelete
    } = require('../src/validators/bulkValidator');

    it('should validate bulk create request', () => {
      const { error, value } = validateBulkCreate({
        concepts: [
          {
            title: 'Design Patterns',
            description: 'Overview of common design patterns in software engineering'
          }
        ]
      });
      expect(error).to.be.undefined;
      expect(value.concepts).to.have.lengthOf(1);
    });

    it('should reject bulk create with invalid data', () => {
      const { error } = validateBulkCreate({
        concepts: [
          {
            title: 'X' // Too short
          }
        ]
      });
      expect(error).to.exist;
    });

    it('should validate bulk archive request', () => {
      const { error, value } = validateBulkArchive({
        conceptIds: ['id1', 'id2', 'id3']
      });
      expect(error).to.be.undefined;
      expect(value.conceptIds).to.have.lengthOf(3);
    });

    it('should validate bulk delete with confirmation', () => {
      const { error } = validateBulkDelete({
        conceptIds: ['id1'],
        confirmation: 'DELETE'
      });
      expect(error).to.be.undefined;
    });

    it('should reject bulk delete without proper confirmation', () => {
      const { error } = validateBulkDelete({
        conceptIds: ['id1'],
        confirmation: 'CONFIRM'
      });
      expect(error).to.exist;
    });
  });

  // ===== Cache Tests =====
  describe('Caching Utility', () => {
    const { cache } = require('../src/utils/cache');

    beforeEach(() => {
      cache.clear();
    });

    it('should cache and retrieve values', () => {
      cache.set('test_key', { data: 'test' });
      const cached = cache.get('test_key');
      expect(cached).to.deep.equal({ data: 'test' });
    });

    it('should expire cached values after TTL', (done) => {
      cache.set('ttl_key', 'value', 1); // 1 second TTL
      expect(cache.get('ttl_key')).to.equal('value');

      setTimeout(() => {
        expect(cache.get('ttl_key')).to.be.null;
        done();
      }, 1100);
    });

    it('should check if key exists', () => {
      cache.set('exist_key', 'value');
      expect(cache.has('exist_key')).to.be.true;
      expect(cache.has('nonexistent')).to.be.false;
    });

    it('should delete cache entries', () => {
      cache.set('delete_key', 'value');
      cache.delete('delete_key');
      expect(cache.get('delete_key')).to.be.null;
    });

    it('should return cache stats', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      const stats = cache.stats();
      expect(stats.size).to.equal(2);
      expect(stats.entries).to.include.members(['key1', 'key2']);
    });
  });

  // ===== Query Optimizer Tests =====
  describe('Query Optimizer', () => {
    const { QueryBuilder } = require('../src/utils/queryOptimizer');

    it('should build text search query', () => {
      const mockModel = {
        find: () => ({
          select: function() { return this; },
          sort: function() { return this; },
          lean: function() { return this; },
          skip: function() { return this; },
          limit: function() { return this; },
          exec: async () => []
        })
      };

      const builder = new QueryBuilder(mockModel);
      builder.textSearch('javascript');
      expect(builder.query.$text).to.exist;
      expect(builder.query.$text.$search).to.equal('javascript');
    });

    it('should build range query', () => {
      const mockModel = { find: () => ({}) };
      const builder = new QueryBuilder(mockModel);
      builder.range('voteCount', 5, 20);
      expect(builder.query.voteCount.$gte).to.equal(5);
      expect(builder.query.voteCount.$lte).to.equal(20);
    });

    it('should build regex query', () => {
      const mockModel = { find: () => ({}) };
      const builder = new QueryBuilder(mockModel);
      builder.regex('title', 'design');
      expect(builder.query.title.$regex).to.exist;
    });

    it('should support method chaining', () => {
      const mockModel = { find: () => ({}) };
      const builder = new QueryBuilder(mockModel);
      builder
        .exactMatch('category', 'Backend')
        .sort('votes', 'desc')
        .paginate(1, 10);

      expect(builder.query.category).to.equal('Backend');
      expect(builder.options.limit).to.equal(10);
    });
  });

  // ===== Performance Monitoring Tests =====
  describe('Performance Monitoring', () => {
    const {
      performanceMonitor,
      getPerformanceStats,
      clearPerformanceMetrics
    } = require('../src/middlewares/performance');

    beforeEach(() => {
      clearPerformanceMetrics();
    });

    it('should track request metrics', (done) => {
      const mockReq = { method: 'GET', path: '/test' };
      const mockRes = {
        statusCode: 200,
        set: () => {},
        json: function(data) {
          return data;
        }
      };
      const mockNext = () => {};

      performanceMonitor(mockReq, mockRes, mockNext);
      mockRes.json({ success: true });

      setTimeout(() => {
        const stats = getPerformanceStats();
        expect(stats.totalRequests).to.equal(1);
        done();
      }, 50);
    });

    it('should collect performance statistics', () => {
      // Mock request tracking
      require('../src/middlewares/performance').performanceMetrics.requests.push({
        timestamp: new Date(),
        method: 'GET',
        path: '/api/concepts',
        statusCode: 200,
        duration: 45,
        memoryDelta: { heapUsed: 0.5 },
        queryCount: 3,
        userId: 'user123'
      });

      const stats = getPerformanceStats();
      expect(stats).to.have.property('totalRequests');
      expect(stats).to.have.property('requestDuration');
      expect(stats).to.have.property('byPath');
    });
  });

  // ===== Query Counter Tests =====
  describe('Query Counter Middleware', () => {
    const { queryCounter, incrementQueryCount } = require('../src/middlewares/performance');

    it('should initialize query counter on request', () => {
      const req = {};
      queryCounter(req, {}, () => {});
      expect(req.queryCount).to.equal(0);
    });

    it('should increment query count', () => {
      const req = { queryCount: 0 };
      incrementQueryCount(req);
      expect(req.queryCount).to.equal(1);
    });
  });
});

module.exports = {
  describeBlock: describe
};
