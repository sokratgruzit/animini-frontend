import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import {
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoDiamondOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { Button, StatCard, LoadingScreen } from '../../../shared/ui';
import { Table, THead, TBody, TH, TR } from '../../../shared/ui/table/Table';
import { TransactionRow } from '../../../entities/wallet/ui/TransactionRow';
import { WALLET_COLUMNS } from '../../../shared/config/columns';
import {
  useWallet,
  useTransactions,
  useCheckPaymentStatus,
} from '../../../entities/wallet';
import { togglePanel } from '../../../features/panel';
import type { AppDispatch } from '../../../app/store';

const WalletPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  /**
   * Server State management via React Query hooks
   */
  const { balance, reputation, isLoading: isWalletLoading } = useWallet();

  const {
    transactions,
    isLoading: isTxLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTransactions();

  /**
   * Mutation for manual payment verification
   */
  const { mutate: checkStatus, isPending: isCheckingStatus } =
    useCheckPaymentStatus();

  const activeColumns = useMemo(() => {
    return WALLET_COLUMNS.filter((col) => col.priority <= 4).map(
      (col) => col.id
    );
  }, []);

  useEffect(() => {
    const pendingId = sessionStorage.getItem('pendingTransactionId');

    if (pendingId) {
      setVerifyingId(pendingId);

      checkStatus(pendingId, {
        onSettled: () => setVerifyingId(null),
      });
    }
  }, [checkStatus]);

  /**
   * Infinite scroll handler using React Query helpers
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;

    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleOpenDeposit = () => {
    dispatch(togglePanel({ side: 'right', content: 'wallet' }));
  };

  /**
   * Combined loading condition for the initial verification overlay
   */
  const showOverlay =
    !!verifyingId && (isCheckingStatus || isTxLoading || isWalletLoading);

  return (
    <div className="flex flex-col h-screen overflow-hidden pointer-events-auto bg-dark-base">
      <AnimatePresence>
        {showOverlay && <LoadingScreen message="Verifying Transaction..." />}
      </AnimatePresence>

      <div className="shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full order-2 md:order-1 md:w-auto">
            <StatCard
              title="Balance"
              value={balance.toLocaleString()}
              icon={IoDiamondOutline}
              iconColor="text-brand-primary"
              className="w-full sm:flex-1 md:flex-none md:w-44 panel-glass border-glass-border"
            />
            <StatCard
              title="Reputation"
              value={reputation}
              icon={IoShieldCheckmarkOutline}
              iconColor="text-brand-success"
              className="w-full sm:flex-1 md:flex-none md:w-44 panel-glass border-glass-border"
            />
          </div>

          <div className="flex items-center gap-2 h-12 w-full order-1 md:order-2 md:w-auto shrink-0 justify-end">
            <Button
              variant="primary"
              onClick={handleOpenDeposit}
              className="h-12 px-0 sm:px-5 w-12 sm:w-auto flex items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-brand-glow bg-brand-primary shrink-0"
            >
              <IoArrowDownCircleOutline size={22} />
              <span className="hidden sm:inline">Deposit</span>
            </Button>
            <Button
              variant="secondary"
              className="h-12 px-0 sm:px-5 w-12 sm:w-auto flex items-center justify-center gap-2 rounded-xl text-sm font-bold bg-glass-bg border border-glass-border text-surface-100 shrink-0"
            >
              <IoArrowUpCircleOutline size={22} />
              <span className="hidden sm:inline">Withdraw</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-8 pb-8 min-h-0">
        <div className="h-full panel-glass border-glass-border overflow-hidden flex flex-col shadow-2xl">
          <div className="px-6 py-4 border-b border-glass-border flex justify-between items-center bg-glass-bg/50 shrink-0">
            <h3 className="text-label">Transaction History</h3>
            <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded tracking-widest">
              {transactions.length} RECORDS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
            <Table>
              <THead>
                <TR>
                  {WALLET_COLUMNS.filter((col) =>
                    activeColumns.includes(col.id)
                  ).map((col) => (
                    <TH
                      key={col.id}
                      className="text-surface-300 uppercase text-micro tracking-widest"
                    >
                      {col.label}
                    </TH>
                  ))}
                </TR>
              </THead>
              <TBody>
                {transactions.map((txn) => (
                  <TransactionRow
                    key={txn.id}
                    transaction={txn}
                    activeColumns={activeColumns}
                  />
                ))}
              </TBody>
            </Table>

            {(isTxLoading || isFetchingNextPage || isCheckingStatus) &&
              !showOverlay && (
                <div className="p-4 text-center text-micro text-surface-300 animate-pulse uppercase tracking-super-wide">
                  Syncing with blockchain...
                </div>
              )}

            {!hasNextPage && transactions.length > 0 && (
              <div className="p-8 text-center text-label opacity-40">
                End of history
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
