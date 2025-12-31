import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../entities/user/model/slice';

/**
 * Global Redux Store configuration
 */
export const store = configureStore({
  reducer: {
    // Client and user state
    user: userSlice.reducer,
    // Add other slices here as needed (e.g., ui-slice for the interactive cube)
  },
});

/**
 * Typed hooks support
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
