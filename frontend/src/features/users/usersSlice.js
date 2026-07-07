import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

export const fetchAdminDashboard = createAsyncThunk('users/dashboard', async (_, { rejectWithValue }) => {
  try { const r = await adminService.getDashboard(); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const banUser   = createAsyncThunk('users/ban',   async (id, { rejectWithValue }) => {
  try { await adminService.banUser(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const unbanUser = createAsyncThunk('users/unban', async (id, { rejectWithValue }) => {
  try { await adminService.unbanUser(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], dashboard: null, loading: false, error: null },
  reducers: { clearError(s) { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchAdminDashboard.pending,   (s) => { s.loading = true; })
     .addCase(fetchAdminDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.dashboard = payload.data; s.items = payload.data?.users || []; })
     .addCase(fetchAdminDashboard.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });
    b.addCase(banUser.fulfilled,   (s, { payload }) => {
       const u = s.items.find(u => u._id === payload); if (u) u.isBanned = true;
     });
    b.addCase(unbanUser.fulfilled, (s, { payload }) => {
       const u = s.items.find(u => u._id === payload); if (u) u.isBanned = false;
     });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
