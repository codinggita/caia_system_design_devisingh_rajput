import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(parseISO(date), 'dd MMM yyyy'); }
  catch { return '—'; }
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '—';
  try { return format(parseISO(date), 'dd MMM yyyy, hh:mm a'); }
  catch { return '—'; }
};

// Relative time (e.g. "2 hours ago")
export const timeAgo = (date) => {
  if (!date) return '—';
  try { return formatDistanceToNow(parseISO(date), { addSuffix: true }); }
  catch { return '—'; }
};

// Truncate text
export const truncate = (str, n = 100) =>
  str && str.length > n ? str.substring(0, n) + '…' : str;

// Capitalize first letter
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Format number with K/M suffix
export const formatNumber = (n) => {
  if (!n && n !== 0) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
};

// Extract error message from axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'An unexpected error occurred.';

// Build query string from object (removes undefined/null)
export const buildQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, v);
  });
  return q.toString();
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
};

// Difficulty badge class
export const difficultyClass = (level) => ({
  beginner:     'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced:     'badge-advanced',
}[level] || 'badge-slate');
