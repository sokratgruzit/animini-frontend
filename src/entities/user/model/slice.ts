import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Basic User profile structure
 */
interface User {
  id: string;
  email: string;
  isActivated: boolean;
}

interface UserState {
  data: User | null;
  isAuth: boolean;
  isAppReady: boolean; // For global loading screen control
}

const initialState: UserState = {
  data: null,
  isAuth: false,
  isAppReady: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Set user after successful login or registration
     */
    setAuth: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isAuth = true;
    },
    /**
     * Called when the app has finished initial checks (auth, assets, etc.)
     */
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
    /**
     * Reset user state on logout
     */
    logout: (state) => {
      state.data = null;
      state.isAuth = false;
    },
  },
});

export const { setAuth, setAppReady, logout } = userSlice.actions;
