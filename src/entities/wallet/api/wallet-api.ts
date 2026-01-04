import { $api } from '../../../shared/api/api';
import type { Transaction } from '../model/types';

interface BalanceResponse {
  balance: number;
  reputation: number;
}

interface TransactionsResponse {
  items: Transaction[];
  total: number;
}

/**
 * Interface for deposit initiation response
 */
interface DepositInitiateResponse {
  success: boolean;
  confirmationUrl: string;
  transactionId: string;
}

/**
 * Interface for payment status check response
 * Synchronized with YooKassa and Backend service statuses (2026)
 */
interface PaymentStatusResponse {
  success: boolean;
  status:
    | 'completed'
    | 'succeeded'
    | 'pending'
    | 'waiting_for_capture'
    | 'canceled';
  newBalance?: number;
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
 * Initiates YooKassa payment session
 */
export const depositFundsRequest = async (amount: number) => {
  const response = await $api.post<DepositInitiateResponse>('/wallet/deposit', {
    amount,
  });
  return response.data;
};

/**
 * Matches GET /api/wallet/status/:transactionId
 * Checks current status of a specific payment
 */
export const checkPaymentStatusRequest = async (transactionId: string) => {
  const response = await $api.get<PaymentStatusResponse>(
    `/wallet/status/${transactionId}`
  );
  return response.data;
};
