import api from './api';
import { buildQuery } from '../utils/formatters';

export const adminService = {
  getDashboard:    ()       => api.get('/admin/dashboard'),
  getAuditLogs:    (params) => api.get('/admin/audit-logs', { params }),
  getUsers:        (params) => api.get(`/admin/users?${buildQuery(params)}`),
  changeRole:      (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  banUser:         (id)     => api.patch(`/admin/users/${id}/ban`),
  unbanUser:       (id)     => api.patch(`/admin/users/${id}/unban`),
  archiveConcept:  (id)     => api.patch(`/admin/concepts/${id}/archive`),
  restoreConcept:  (id)     => api.patch(`/admin/concepts/${id}/restore`),
};
