import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  refreshToken: (token) => api.post('/auth/refresh-token', { token }),
  getProfile:   ()     => api.get('/auth/profile'),
  updateProfile:(data) => api.patch('/auth/profile', data),
  deleteProfile:()     => api.delete('/auth/profile'),
  forgotPassword:(data)=> api.post('/auth/forgot-password', data),
  resetPassword: (data)=> api.post('/auth/reset-password', data),
  verifyEmail:   (data)=> api.post('/auth/verify-email', data),
};
