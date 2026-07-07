import api from './api';
import { buildQuery } from '../utils/formatters';

export const searchService = {
  search:       (params) => api.get(`/search?${buildQuery(params)}`),
  autocomplete: (q)      => api.get(`/search/autocomplete?q=${encodeURIComponent(q)}`),
  fuzzy:        (q)      => api.get(`/search/fuzzy?q=${encodeURIComponent(q)}`),
  byTitle:      (q)      => api.get(`/search/title?q=${encodeURIComponent(q)}`),
  byContent:    (q)      => api.get(`/search/content?q=${encodeURIComponent(q)}`),
  byCategory:   (q)      => api.get(`/search/category?q=${encodeURIComponent(q)}`),
  byDifficulty: (q)      => api.get(`/search/difficulty?q=${encodeURIComponent(q)}`),
  byLanguage:   (q)      => api.get(`/search/language?q=${encodeURIComponent(q)}`),
  byPattern:    (q)      => api.get(`/search/patterns?q=${encodeURIComponent(q)}`),
  byTags:       (q)      => api.get(`/search/tags?q=${encodeURIComponent(q)}`),
  popular:      (limit)  => api.get(`/search/popular?limit=${limit || 10}`),
  recent:       (limit)  => api.get(`/search/recent?limit=${limit || 10}`),
};

export const filterService = {
  byDifficulty: (level)  => api.get(`/filter/difficulty?level=${level}`),
  byCategory:   (name)   => api.get(`/filter/category?name=${encodeURIComponent(name)}`),
  byLanguage:   (name)   => api.get(`/filter/language?name=${encodeURIComponent(name)}`),
  byPattern:    (name)   => api.get(`/filter/pattern?name=${encodeURIComponent(name)}`),
  byTags:       (list)   => api.get(`/filter/tags?list=${list}`),
  popular:      ()       => api.get('/filter/popular'),
  trending:     ()       => api.get('/filter/trending'),
  frontend:     ()       => api.get('/filter/frontend'),
  backend:      ()       => api.get('/filter/backend'),
  devops:       ()       => api.get('/filter/devops'),
  byCloud:      ()       => api.get('/filter/cloud'),
  byDate:       (after)  => api.get(`/filter/date?after=${after}`),
  unexplored:   ()       => api.get('/filter/unexplored'),
  expertOnly:   ()       => api.get('/filter/expert-only'),
  myBookmarks:  ()       => api.get('/filter/bookmarks'),
};
