/**
 * Centralized query keys for TanStack Query to avoid typos
 * and ensure consistent cache invalidation across the app.
 */
export const VIDEO_KEYS = {
  all: ['videos'] as const,
  workspace: () => [...VIDEO_KEYS.all, 'workspace'] as const,
  details: (id: string) => [...VIDEO_KEYS.all, 'details', id] as const,
};

/**
 * Unified Query Keys for the entire application.
 */
export const QUERY_KEYS = {
  // Video & Series keys we added before
  videos: {
    all: ['videos'] as const,
    workspace: () => ['videos', 'workspace'] as const,
    details: (id: string) => ['videos', 'details', id] as const,
  },

  // Wallet & Economy keys (New)
  wallet: {
    all: ['wallet'] as const,
    balance: () => ['wallet', 'balance'] as const,
    transactions: () => ['wallet', 'transactions'] as const,
    // Key for polling specific transaction status
    paymentStatus: (id: string) => ['wallet', 'status', id] as const,
  },
};
