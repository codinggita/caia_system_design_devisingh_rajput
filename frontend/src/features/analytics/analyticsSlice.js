import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analyticsService';

export const fetchTopConcepts   = createAsyncThunk('analytics/topConcepts',   async (p, { rejectWithValue }) => {
  try { const r = await analyticsService.getTopConcepts(p);   return r.data; } catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const fetchCreationTrend = createAsyncThunk('analytics/creationTrend', async (p, { rejectWithValue }) => {
  try { const r = await analyticsService.getCreationTrend(p); return r.data; } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { topConcepts: [], creationTrend: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTopConcepts.pending,   (s) => { s.loading = true; })
     .addCase(fetchTopConcepts.fulfilled, (s, { payload }) => { s.loading = false; s.topConcepts = payload.data || []; })
     .addCase(fetchTopConcepts.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });
    b.addCase(fetchCreationTrend.fulfilled, (s, { payload }) => { s.creationTrend = payload.data || []; });
  },
});

export default analyticsSlice.reducer;
