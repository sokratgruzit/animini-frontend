import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { checkAuthRequest, logoutRequest } from '../api/user-api';

/**
 * User profile structure synchronized with the backend (2026)
 */
interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  isAdmin: boolean;
  roles: string[];
}

interface UserState {
  data: User | null;
  isAuth: boolean;
  isAppReady: boolean;
}

const initialState: UserState = {
  data: null,
  isAuth: false,
  isAppReady: false,
};

/**
 * Async Thunk for initial authentication check.
 */
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, thunkAPI) => {
    try {
      const response = await checkAuthRequest();
      localStorage.setItem('accessToken', response.accessToken);
      return response.user;
    } catch (e) {
      localStorage.removeItem('accessToken');
      return thunkAPI.rejectWithValue('Unauthorized');
    }
  }
);

/**
 * Async Thunk for logging out.
 * Ensures the session is terminated on the backend and client is cleaned.
 */
export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logoutRequest();
    } catch (e) {
      return thunkAPI.rejectWithValue('Logout failed');
    } finally {
      /**
       * Always remove token even if the server request fails
       * to prevent local state persistence.
       */
      localStorage.removeItem('accessToken');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isAuth = true;
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
    /**
     * Synchronous state reset.
     * Used for 401 errors to avoid extra API calls.
     */
    resetUserState: (state) => {
      state.data = null;
      state.isAuth = false;
      localStorage.removeItem('accessToken');
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
      /**
       * Handle state cleanup regardless of API response success or failure
       */
      .addCase(userLogout.fulfilled, (state) => {
        state.data = null;
        state.isAuth = false;
      })
      .addCase(userLogout.rejected, (state) => {
        state.data = null;
        state.isAuth = false;
      });
  },
});

export const { setAuth, setAppReady, resetUserState } = userSlice.actions;
