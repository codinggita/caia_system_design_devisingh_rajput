import api from './api';

export const profileService = {
  get:    ()     => api.get('/profile'),
  update: (data) => api.patch('/profile', data),
};

export const progressService = {
  get:    ()     => api.get('/progress'),
  update: (data) => api.patch('/progress', data),
};

export const achievementService = {
  list: () => api.get('/achievements'),
};

export const notificationService = {
  list:    (params) => api.get('/notifications', { params }),
  markRead:(id)     => api.patch(`/notifications/${id}/read`),
  markAllRead: ()   => api.patch('/notifications/read-all'),
};

export const preferenceService = {
  get:    ()     => api.get('/preferences'),
  update: (data) => api.patch('/preferences', data),
};

export const systemService = {
  status:   () => api.get('/system/status'),
  dbStatus: () => api.get('/system/database/status'),
  uptime:   () => api.get('/system/uptime'),
  version:  () => api.get('/system/version'),
  cache:    () => api.get('/system/cache/status'),
};
