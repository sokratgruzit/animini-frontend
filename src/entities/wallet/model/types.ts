export type TransactionType =
  | 'deposit'
  | 'author_payout'
  | 'review_cost'
  | 'user_vote_cost'
  | 'critic_reward'
  | 'withdraw'
  | 'transfer';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  currency: string;
}

export interface WalletState {
  balance: number; // Spendable coins
  reputation: number; // Critic experience points/rank
  transactions: {
    items: Transaction[];
    page: number;
    hasMore: boolean;
    limit: number;
  };
  isLoading: boolean;
  error: string | null;
}
