import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
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

/**
 * Custom hooks for use in components to avoid repeating types
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
