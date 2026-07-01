import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { STORAGE_KEYS } from '../../utils/constants';

// ── Helpers ─────────────────────────────────────────────────────
const persistUser = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER,  JSON.stringify(user));
};
const clearPersist = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};
const loadUser = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)); }
  catch { return null; }
};

// ── Thunks ───────────────────────────────────────────────────────
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getProfile();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.updateProfile(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

// ── Slice ────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token:           localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
    user:            loadUser(),
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
    loading:         false,
    error:           null,
  },
  reducers: {
    logout(state) {
      state.token           = null;
      state.user            = null;
      state.isAuthenticated = false;
      state.error           = null;
      clearPersist();
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.loading         = false;
        s.token           = payload.data?.token;
        s.user            = payload.data?.user;
        s.isAuthenticated = true;
        persistUser(payload.data?.token, payload.data?.user);
      })
      .addCase(loginUser.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      });
    // Register
    builder
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.loading         = false;
        s.token           = payload.data?.token;
        s.user            = payload.data?.user;
        s.isAuthenticated = true;
        persistUser(payload.data?.token, payload.data?.user);
      })
      .addCase(registerUser.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      });
    // Fetch profile
    builder
      .addCase(fetchProfile.fulfilled, (s, { payload }) => {
        s.user = payload.data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload.data));
      });
    // Update profile
    builder
      .addCase(updateProfile.fulfilled, (s, { payload }) => {
        s.user = { ...s.user, ...payload.data };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(s.user));
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
