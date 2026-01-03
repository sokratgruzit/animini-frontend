import { $api } from '../../../shared/api/api';
import type { Transaction } from '../model/types';

// Updated to match your backend response
interface BalanceResponse {
  balance: number;
  reputation: number; // Ensure backend returns this in getBalance
}

interface TransactionsResponse {
  items: Transaction[];
  total: number;
}

/**
 * Matches GET /api/wallet/balance
 */
export const fetchWalletDataRequest = async () => {
  const response = await $api.get<BalanceResponse>('/wallet/balance');
  return response.data;
};

/**
 * Matches GET /api/wallet/transactions
 */
export const fetchTransactionsRequest = async (page: number, limit: number) => {
  const response = await $api.get<TransactionsResponse>(
    '/wallet/transactions',
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * Matches POST /api/wallet/deposit
 */
export const depositFundsRequest = async (amount: number) => {
  const response = await $api.post('/wallet/deposit', { amount });
  return response.data;
};
