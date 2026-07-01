import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { conceptService } from '../../services/conceptService';

export const fetchConcepts = createAsyncThunk('concepts/fetchAll', async (params, { rejectWithValue }) => {
  try { const r = await conceptService.list(params); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load concepts'); }
});
export const fetchConceptById = createAsyncThunk('concepts/fetchById', async (id, { rejectWithValue }) => {
  try { const r = await conceptService.getById(id); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load concept'); }
});
export const createConcept = createAsyncThunk('concepts/create', async (data, { rejectWithValue }) => {
  try { const r = await conceptService.create(data); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create concept'); }
});
export const updateConcept = createAsyncThunk('concepts/update', async ({ id, data }, { rejectWithValue }) => {
  try { const r = await conceptService.update(id, data); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update concept'); }
});
export const archiveConcept = createAsyncThunk('concepts/archive', async (id, { rejectWithValue }) => {
  try { await conceptService.archive(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to archive concept'); }
});

const conceptsSlice = createSlice({
  name: 'concepts',
  initialState: {
    items:      [],
    selected:   null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    filters:    { category: '', difficulty: '', language: '', search: '' },
    loading:    false,
    error:      null,
  },
  reducers: {
    setFilters(s, { payload }) { s.filters = { ...s.filters, ...payload }; },
    clearSelected(s)           { s.selected = null; },
    clearError(s)              { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchConcepts.pending,   (s)    => { s.loading = true; s.error = null; })
     .addCase(fetchConcepts.fulfilled, (s, { payload }) => {
       s.loading    = false;
       s.items      = payload.data?.concepts || payload.data || [];
       s.pagination = payload.data?.pagination || s.pagination;
     })
     .addCase(fetchConcepts.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });

    b.addCase(fetchConceptById.pending,   (s)    => { s.loading = true; })
     .addCase(fetchConceptById.fulfilled, (s, { payload }) => { s.loading = false; s.selected = payload.data; })
     .addCase(fetchConceptById.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });

    b.addCase(createConcept.fulfilled, (s, { payload }) => {
       s.items.unshift(payload.data);
     });
    b.addCase(updateConcept.fulfilled, (s, { payload }) => {
       const idx = s.items.findIndex(c => c._id === payload.data?._id);
       if (idx !== -1) s.items[idx] = payload.data;
       if (s.selected?._id === payload.data?._id) s.selected = payload.data;
     });
    b.addCase(archiveConcept.fulfilled, (s, { payload }) => {
       s.items = s.items.filter(c => c._id !== payload);
     });
  },
});

export const { setFilters, clearSelected, clearError } = conceptsSlice.actions;
export default conceptsSlice.reducer;
