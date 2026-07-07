import api from './api';

export const discoveryService = {
  dailyChallenge: ()      => api.get('/discovery/daily-challenge'),
  expertPicks:    ()      => api.get('/discovery/expert-picks'),
  hiddenGems:     ()      => api.get('/discovery/hidden-gems'),
  trending:       ()      => api.get('/discovery/trending'),
  recommended:    (params)=> api.get('/discovery/recommended', { params }),
  suggestNext:    (id)    => api.get(`/discovery/suggest-next/${id}`),
  roadmap:        (type)  => api.get(`/discovery/roadmap/${type}`),
};

export const taxonomyService = {
  categories:    () => api.get('/categories'),
  subcategories: () => api.get('/subcategories'),
  tags:          () => api.get('/tags'),
  patterns:      () => api.get('/patterns'),
  languages:     () => api.get('/languages'),
  difficulty:    () => api.get('/difficulty'),
  questionTypes: () => api.get('/question-types'),
  getByCategory: (cat) => api.get(`/categories/${cat}/concepts`),
  getByTag:      (tag) => api.get(`/tags/${tag}`),
  getByPattern:  (p)   => api.get(`/patterns/${p}`),
  getByLanguage: (l)   => api.get(`/languages/${l}`),
  getByDifficulty:(d)  => api.get(`/difficulty/${d}`),
  getByType:     (t)   => api.get(`/question-types/${t}`),
};

export const categoryService = {
  list:        (params) => api.get('/categories', { params }),
  getByName:   (name)   => api.get(`/categories/${encodeURIComponent(name)}`),
  getConcepts: (name)   => api.get(`/categories/${encodeURIComponent(name)}/concepts`),
  difficulties:()       => api.get('/difficulty'),
  languages:   ()       => api.get('/languages'),
  patterns:    (params) => api.get('/patterns', { params }),
  tags:        ()       => api.get('/tags'),
  questionTypes: ()     => api.get('/question-types'),
  subcategories: ()     => api.get('/subcategories'),
};
