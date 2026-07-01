import api from './api';
import { buildQuery } from '../utils/formatters';

export const conceptService = {
  list:    (params) => api.get(`/concepts?${buildQuery(params)}`),
  getById: (id)     => api.get(`/concepts/${id}`),
  create:  (data)   => api.post('/concepts', data),
  update:  (id, data) => api.patch(`/concepts/${id}`, data),
  archive: (id)     => api.patch(`/concepts/${id}/archive`),
  restore: (id)     => api.patch(`/concepts/${id}/restore`),
  getHistory: (id)  => api.get(`/concepts/${id}/history`),
  getRelated: (id)  => api.get(`/concepts/${id}/related`),
  getSummary: (id)  => api.get(`/concepts/${id}/summary`),
  getLatest:  (p)   => api.get(`/concepts/latest?${buildQuery(p)}`),
  getPopular: (p)   => api.get(`/concepts/popular?${buildQuery(p)}`),
  getRandom:  ()    => api.get('/concepts/random'),
  getTrending:(p)   => api.get(`/concepts/trending?${buildQuery(p)}`),
  // Bulk (Admin)
  bulkCreate:  (data) => api.post('/concepts/bulk/create', data),
  bulkArchive: (data) => api.patch('/concepts/bulk/archive', data),
  bulkRestore: (data) => api.patch('/concepts/bulk/restore', data),
  bulkDelete:  (data) => api.delete('/concepts/bulk/delete', { data }),
};
