// ================================================================
// CAIA Frontend — Application Constants
// Mapped directly from backend API endpoints
// ================================================================

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CAIA System Design';
export const API_URL  = import.meta.env.VITE_API_URL  || 'http://localhost:3000/api/v1';

// ----------------------------------------------------------------
// Storage Keys
// ----------------------------------------------------------------
export const STORAGE_KEYS = {
  TOKEN:     'caia_token',
  THEME:     'caia_theme',
  USER:      'caia_user',
  FILTERS:   'caia_filters',    // sessionStorage
  FORM_STEP: 'caia_form_step',  // sessionStorage
};

// ----------------------------------------------------------------
// Roles (from User model)
// ----------------------------------------------------------------
export const ROLES = {
  USER:  'user',
  ADMIN: 'admin',
};

// ----------------------------------------------------------------
// Difficulty levels (from Concept model)
// ----------------------------------------------------------------
export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

export const DIFFICULTY_COLORS = {
  beginner:     'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced:     'badge-advanced',
};

// ----------------------------------------------------------------
// Concept question types (from Concept model)
// ----------------------------------------------------------------
export const QUESTION_TYPES = [
  'open-ended',
  'system-design',
  'conceptual',
  'practical',
  'comparison',
];

// ----------------------------------------------------------------
// Categories (common system design categories)
// ----------------------------------------------------------------
export const CATEGORIES = [
  'Foundations',
  'Scalability',
  'Real-time Systems',
  'Databases',
  'Distributed Systems',
  'Security',
  'Caching',
  'Messaging',
  'Microservices',
  'DevOps',
  'Frontend',
  'Backend',
];

// ----------------------------------------------------------------
// Discovery roadmap types
// ----------------------------------------------------------------
export const ROADMAP_TYPES = ['backend', 'frontend', 'devops', 'system-design'];

// ----------------------------------------------------------------
// Notification channels (from Notification model)
// ----------------------------------------------------------------
export const NOTIFICATION_CHANNELS = ['in-app', 'email', 'push'];

// ----------------------------------------------------------------
// Achievement statuses (from UserAchievement model)
// ----------------------------------------------------------------
export const ACHIEVEMENT_STATUS = { LOCKED: 'locked', UNLOCKED: 'unlocked' };

// ----------------------------------------------------------------
// Pagination defaults
// ----------------------------------------------------------------
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

// ----------------------------------------------------------------
// Theme
// ----------------------------------------------------------------
export const THEMES = { DARK: 'dark', LIGHT: 'light' };
