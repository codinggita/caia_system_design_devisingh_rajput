import axios from 'axios';
import toast from 'react-hot-toast';
import { STORAGE_KEYS } from '../utils/constants';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// ----------------------------------------------------------------
// Axios Instance
// ----------------------------------------------------------------
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ----------------------------------------------------------------
// Request Interceptor — attach JWT token & Log requests
// ----------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // Log API request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------
// Response Interceptor — handle errors globally & Log responses
// ----------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    // Log API response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    const status  = error?.response?.status;
    const message = error?.response?.data?.message || error.message;

    // Retry logic for transient errors (5xx or Network Error)
    // Only retry if we haven't reached retry limit (default 2)
    const maxRetries = config?.retry ?? 2;
    config.__retryCount = config?.__retryCount ?? 0;

    if (config && (status >= 500 || !status) && config.__retryCount < maxRetries) {
      config.__retryCount += 1;
      
      const backoff = Math.pow(2, config.__retryCount) * 1000;
      console.warn(`[API Retry] ${config.method.toUpperCase()} ${config.url} | Attempt ${config.__retryCount} | Retrying in ${backoff}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, backoff));
      return api(config);
    }

    // Log API error
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${status} | Message: ${message}`);

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Optional: redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    // Show toast for non-silent errors
    if (!error.config?.silent) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
