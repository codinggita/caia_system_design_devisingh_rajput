import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, THEMES } from '../../utils/constants';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme:         localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.DARK,
    sidebarOpen:   true,
    globalLoading: false,
    modal:         { open: false, type: null, data: null },
  },
  reducers: {
    toggleTheme(s) {
      s.theme = s.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      localStorage.setItem(STORAGE_KEYS.THEME, s.theme);
      document.documentElement.classList.toggle('light', s.theme === THEMES.LIGHT);
    },
    setTheme(s, { payload }) {
      s.theme = payload;
      localStorage.setItem(STORAGE_KEYS.THEME, payload);
      document.documentElement.classList.toggle('light', payload === THEMES.LIGHT);
    },
    toggleSidebar(s)       { s.sidebarOpen = !s.sidebarOpen; },
    setSidebarOpen(s, { payload }) { s.sidebarOpen = payload; },
    setGlobalLoading(s, { payload }) { s.globalLoading = payload; },
    openModal(s, { payload })  { s.modal = { open: true,  type: payload.type,  data: payload.data || null }; },
    closeModal(s)              { s.modal = { open: false, type: null, data: null }; },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen, setGlobalLoading, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
