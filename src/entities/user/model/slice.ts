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
 * Handles the combined response of user data and access token.
 */
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, thunkAPI) => {
    try {
      const response = await checkAuthRequest();
      /**
       * Store the new access token received from the refresh call
       */
      localStorage.setItem('accessToken', response.accessToken);
      return response.user;
    } catch (e) {
      localStorage.removeItem('accessToken');
      return thunkAPI.rejectWithValue('Unauthorized');
    }
  }
);

/**
 * Async Thunk for logging out
 */
export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logoutRequest();
      localStorage.removeItem('accessToken');
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
     * Set user data and authentication status
     */
    setAuth: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isAuth = true;
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
    /**
     * Clean up user state and local storage
     */
    logout: (state) => {
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
      .addCase(userLogout.fulfilled, (state) => {
        state.data = null;
        state.isAuth = false;
      });
  },
});

export const { setAuth, setAppReady, logout } = userSlice.actions;
