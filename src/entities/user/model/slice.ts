import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { checkAuthRequest, logoutRequest } from '../api/user-api';

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

/**
 * Async Thunk to perform initial auth check.
 */
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, thunkAPI) => {
    try {
      const data = await checkAuthRequest();
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue('Unauthorized');
    }
  }
);

/**
 * Async Thunk to perform logout on the server and client.
 */
export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logoutRequest();
      // After server responds, we return nothing, extraReducers will handle the rest
    } catch (e) {
      return thunkAPI.rejectWithValue('Logout failed');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.data = action.payload;
        state.isAuth = true;
        state.isAppReady = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.data = null;
        state.isAuth = false;
        state.isAppReady = true;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.data = null;
        state.isAuth = false;
      });
  },
});

export const { setAuth, setAppReady, logout } = userSlice.actions;
