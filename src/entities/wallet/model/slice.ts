import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  fetchWalletDataRequest,
  fetchTransactionsRequest,
} from '../api/wallet-api';
import type { WalletState, Transaction } from './types';

/**
 * Thunk to fetch balance and reputation
 */
export const getWalletData = createAsyncThunk(
  'wallet/getWalletData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const data = await fetchWalletDataRequest();
      dispatch(setWalletData(data));
      return data;
    } catch (e) {
      dispatch(setError('Failed to fetch wallet information'));
      return rejectWithValue(e);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Thunk for paginated transactions history
 * @param isRefresh - if true, resets to page 1 and clears existing items
 */
export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (
    isRefresh: boolean = false,
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { page, limit } = state.wallet.transactions;

    const targetPage = isRefresh ? 1 : page;

    try {
      dispatch(setLoading(true));
      const data = await fetchTransactionsRequest(targetPage, limit);

      if (isRefresh) {
        dispatch(setTransactions(data.items));
      } else {
        dispatch(appendTransactions(data.items));
      }

      return data;
    } catch (e) {
      dispatch(setError('Failed to load transaction history'));
      return rejectWithValue(e);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState: WalletState = {
  balance: 0,
  reputation: 0,
  transactions: {
    items: [],
    page: 1,
    hasMore: true,
    limit: 20,
  },
  isLoading: false,
  error: null,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletData: (
      state,
      action: PayloadAction<{ balance: number; reputation: number }>
    ) => {
      state.balance = action.payload.balance;
      state.reputation = action.payload.reputation;
    },

    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions.items = action.payload;
      state.transactions.page = 2; // Next page will be 2
      state.transactions.hasMore =
        action.payload.length >= state.transactions.limit;
    },

    appendTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions.items = [
        ...state.transactions.items,
        ...action.payload,
      ];
      state.transactions.page += 1;
      state.transactions.hasMore =
        action.payload.length >= state.transactions.limit;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetWallet: () => initialState,
  },
});

export const {
  setWalletData,
  setTransactions,
  appendTransactions,
  setLoading,
  setError,
  resetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
