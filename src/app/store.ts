import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../entities/user/model/slice';
import { panelSlice } from '../features/panel/model/slice';
import { walletSlice } from '../entities/wallet';

/**
 * Global Redux Store configuration
 */
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    panel: panelSlice.reducer,
    wallet: walletSlice.reducer,
  },
});

/**
 * Typed hooks support
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
