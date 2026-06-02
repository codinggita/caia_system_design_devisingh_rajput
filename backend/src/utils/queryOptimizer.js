/**
 * queryOptimizer.js
 * -----
 * Utilities for building optimized MongoDB queries.
 * Includes query building, indexing strategies, and performance hints.
 */

/**
 * Build optimized query with proper indexing
 * Handles common patterns like text search, range queries, etc.
 */
class QueryBuilder {
  constructor(model) {
    this.model = model;
    this.query = {};
    this.options = {
      lean: true, // Return plain objects (faster than mongoose documents)
      select: null, // Field selection
      sort: null,
      skip: 0,
      limit: 20,
      hint: null // Explicit index hint
    };
  }

  /**
   * Add text search to query
   * @param {string} searchText - Text to search
   * @returns {QueryBuilder} For chaining
   */
  textSearch(searchText) {
    this.query.$text = { $search: searchText };
    this.options.sort = { score: { $meta: 'textScore' } };
    return this;
  }

  /**
   * Add exact match filter
   * @param {string} field - Field name
   * @param {*} value - Value to match
   * @returns {QueryBuilder} For chaining
   */
  exactMatch(field, value) {
    this.query[field] = value;
    return this;
  }

  /**
   * Add range filter
   * @param {string} field - Field name
   * @param {*} min - Minimum value (inclusive)
   * @param {*} max - Maximum value (inclusive)
   * @returns {QueryBuilder} For chaining
   */
  range(field, min, max) {
    this.query[field] = {};
    if (min !== undefined) {
      this.query[field].$gte = min;
    }
    if (max !== undefined) {
      this.query[field].$lte = max;
    }
    return this;
  }

  /**
   * Add regex pattern filter (case-insensitive)
   * @param {string} field - Field name
   * @param {string} pattern - Regex pattern
   * @returns {QueryBuilder} For chaining
   */
  regex(field, pattern) {
    this.query[field] = { $regex: new RegExp(pattern, 'i') };
    return this;
  }

  /**
   * Add array contains filter
   * @param {string} field - Field name (should be array field)
   * @param {*} value - Value to find in array
   * @returns {QueryBuilder} For chaining
   */
  arrayContains(field, value) {
    this.query[field] = { $in: Array.isArray(value) ? value : [value] };
    return this;
  }

  /**
   * Add sorting
   * @param {string} field - Field to sort by
   * @param {string} direction - 'asc' or 'desc'
   * @returns {QueryBuilder} For chaining
   */
  sort(field, direction = 'asc') {
    this.options.sort = {
      [field]: direction === 'desc' ? -1 : 1
    };
    return this;
  }

  /**
   * Select specific fields
   * @param {string|array} fields - Fields to return
   * @returns {QueryBuilder} For chaining
   */
  select(fields) {
    this.options.select = fields;
    return this;
  }

  /**
   * Add pagination
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @returns {QueryBuilder} For chaining
   */
  paginate(page, limit) {
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    this.options.skip = (page - 1) * limit;
    this.options.limit = limit;
    return this;
  }

  /**
   * Add index hint (for query optimization)
   * @param {string} indexName - Name of index to use
   * @returns {QueryBuilder} For chaining
   */
  hint(indexName) {
    this.options.hint = indexName;
    return this;
  }

  /**
   * Exclude archived documents by default
   * @returns {QueryBuilder} For chaining
   */
  excludeArchived() {
    this.query.isArchived = { $ne: true };
    return this;
  }

  /**
   * Execute query and return results with pagination meta
   * @returns {Promise} { results, pagination }
   */
  async execute() {
    let q = this.model.find(this.query);

    if (this.options.select) {
      q = q.select(this.options.select);
    }
    if (this.options.sort) {
      q = q.sort(this.options.sort);
    }
    if (this.options.lean) {
      q = q.lean();
    }
    if (this.options.hint) {
      q = q.hint(this.options.hint);
    }

    // Get total count for pagination (before skip/limit)
    const total = await this.model.countDocuments(this.query);
    const page = Math.ceil((this.options.skip + 1) / this.options.limit);

    // Apply pagination
    q = q.skip(this.options.skip).limit(this.options.limit);

    const results = await q.exec();

    return {
      results,
      pagination: {
        total,
        page,
        limit: this.options.limit,
        pages: Math.ceil(total / this.options.limit),
        hasNext: this.options.skip + this.options.limit < total,
        hasPrev: this.options.skip > 0
      }
    };
  }

  /**
   * Count documents matching query
   * @returns {Promise<number>} Count of matching documents
   */
  async count() {
    return this.model.countDocuments(this.query);
  }

  /**
   * Check if any document matches query
   * @returns {Promise<boolean>} True if at least one document matches
   */
  async exists() {
    const count = await this.count();
    return count > 0;
  }
}

/**
 * Query analyzer for debugging and optimization
 */
class QueryAnalyzer {
  /**
   * Analyze query performance
   * @param {object} mongooseQuery - Mongoose query object
   * @returns {Promise<object>} Execution stats
   */
  static async analyzeQuery(mongooseQuery) {
    try {
      const explain = await mongooseQuery.explain('executionStats');
      return {
        executionTime: explain.executionStats.executionStages.executionTimeMillis,
        documentsExamined: explain.executionStats.executionStages.docsExamined,
        documentsReturned: explain.executionStats.nReturned,
        efficiency: (explain.executionStats.nReturned / explain.executionStats.executionStages.docsExamined * 100).toFixed(2),
        stage: explain.executionStats.executionStages.stage
      };
    } catch (err) {
      return { error: err.message };
    }
  }

  /**
   * Suggest indexes for a model based on common queries
   * @param {object} model - Mongoose model
   * @returns {array} Array of suggested index configs
   */
  static suggestIndexes(_model) {
    const suggestions = [
      { name: 'text_search', spec: { title: 'text', description: 'text' } },
      { name: 'category_difficulty', spec: { 'metadata.category': 1, 'metadata.difficulty': 1 } },
      { name: 'votes_desc', spec: { voteCount: -1, createdAt: -1 } },
      { name: 'archived_active', spec: { isArchived: 1, createdAt: -1 } },
      { name: 'user_activity', spec: { userId: 1, createdAt: -1 } }
    ];

    return suggestions;
  }
}

module.exports = {
  QueryBuilder,
  QueryAnalyzer
};
