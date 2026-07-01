import api from './api';

export const bookmarkService = {
  getBookmarks:   ()        => api.get('/me/bookmarks'),
  addBookmark:    (id)      => api.post(`/me/bookmarks/${id}`),
  removeBookmark: (id)      => api.delete(`/me/bookmarks/${id}`),
  getNotes:       (params)  => api.get('/me/notes', { params }),
  upsertNote:     (id, data)=> api.put(`/me/notes/${id}`, data),
  deleteNote:     (id)      => api.delete(`/me/notes/${id}`),
  getActivity:    ()        => api.get('/me/activity'),
};

export const voteService = {
  vote: (conceptId, voteType) => api.post(`/votes/${conceptId}`, { voteType }),
};
