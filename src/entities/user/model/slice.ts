import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { checkAuthRequest, logoutRequest } from '../api/user-api';

/**
 * Synchronized User interface with backend schema
 */
export interface User {
  id: number; // Changed to number to match backend id: Int
  email: string;
  name: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  roles: string[];
  avatarUrl: string | null;
  bio: string | null;
  settings: Record<string, any>;
  balance: number;
  reputation: number;
  createdAt: string;
  updatedAt: string;
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
 */
export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logoutRequest();
    } catch (e) {
      return thunkAPI.rejectWithValue('Logout failed');
    } finally {
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
     * DYNAMIC UPDATE: Used by SSE (Server-Sent Events)
     * to patch user data in real-time.
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
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

export const { setAuth, setAppReady, resetUserState, updateUser } =
  userSlice.actions;
