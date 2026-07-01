import api from './api';

export const analyticsService = {
  getTopConcepts:   (params) => api.get('/analytics/top-concepts', { params }),
  getCreationTrend: (params) => api.get('/analytics/trends', { params }),
  getTotalConcepts: ()       => api.get('/analytics/total-concepts'),
  getCategoryDistribution: () => api.get('/analytics/category-distribution'),
  getDifficultyStats: ()     => api.get('/analytics/difficulty-stats'),
};
