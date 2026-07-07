import { configureStore } from '@reduxjs/toolkit';
import authReducer      from '../features/auth/authSlice';
import conceptsReducer  from '../features/concepts/conceptsSlice';
import usersReducer     from '../features/users/usersSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import uiReducer        from '../features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth:      authReducer,
    concepts:  conceptsReducer,
    users:     usersReducer,
    analytics: analyticsReducer,
    ui:        uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
