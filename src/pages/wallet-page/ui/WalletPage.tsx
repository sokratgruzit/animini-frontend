import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoDiamondOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { Button, StatCard } from '../../../shared/ui';
import { Table, THead, TBody, TH, TR } from '../../../shared/ui/table/Table';
import { TransactionRow } from '../../../entities/wallet/ui/TransactionRow';
import { WALLET_COLUMNS } from '../../../shared/config/columns';
import {
  getWalletData,
  fetchTransactions,
} from '../../../entities/wallet/model/slice';
import type { RootState, AppDispatch } from '../../../app/store';

const WalletPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, reputation, transactions, isLoading } = useSelector(
    (state: RootState) => state.wallet
  );

  // Dynamic columns selection based on priority
  const activeColumns = useMemo(() => {
    return WALLET_COLUMNS.filter((col) => col.priority <= 4).map(
      (col) => col.id
    );
  }, []);

  useEffect(() => {
    dispatch(getWalletData());
    dispatch(fetchTransactions(true));
  }, [dispatch]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Check if we reached the bottom of the scrollable area
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      transactions.hasMore &&
      !isLoading
    ) {
      dispatch(fetchTransactions(false));
    }
  };

  return (
    /* h-screen and overflow-hidden lock the main viewport */
    <div className="flex flex-col h-screen overflow-hidden pointer-events-auto">
      {/* 1. Header Section - Fixed (shrink-0) */}
      <div className="mt-6 px-6 md:px-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3 w-full order-2 md:order-1 md:w-auto md:ml-16">
            <StatCard
              title="Balance"
              value={balance.toLocaleString()}
              icon={IoDiamondOutline}
              iconColor="text-indigo-400"
              className="w-full sm:flex-1 md:flex-none md:w-44"
            />
            <StatCard
              title="Reputation"
              value={reputation}
              icon={IoShieldCheckmarkOutline}
              iconColor="text-emerald-400"
              className="w-full sm:flex-1 md:flex-none md:w-44"
            />
          </div>

          {/* Buttons Row */}
          <div className="flex items-center gap-2 h-12 w-full order-1 md:order-2 md:w-auto ml-auto shrink-0 justify-end">
            <Button
              variant="primary"
              className="h-12 px-0 sm:px-5 w-12 sm:w-auto flex items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/10 shrink-0"
            >
              <IoArrowDownCircleOutline size={22} />
              <span className="hidden sm:inline">Deposit</span>
            </Button>
            <Button
              variant="secondary"
              className="h-12 px-0 sm:px-5 w-12 sm:w-auto flex items-center justify-center gap-2 rounded-xl text-sm font-bold border border-white/5 shrink-0"
            >
              <IoArrowUpCircleOutline size={22} />
              <span className="hidden sm:inline">Withdraw</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Content Section - flex-1 and min-h-0 enable internal scroll */}
      <div className="flex-1 mt-8 px-6 md:px-8 pb-8 min-h-0">
        <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Table Header (static inside card) */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Transaction History
            </h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
              {transactions.items.length} Records
            </span>
          </div>

          {/* 3. The Only Scrollable Area */}
          <div
            className="flex-1 overflow-y-auto scrollbar-none"
            onScroll={handleScroll}
          >
            <Table>
              <THead>
                <TR>
                  {WALLET_COLUMNS.filter((col) =>
                    activeColumns.includes(col.id)
                  ).map((col) => (
                    <TH key={col.id}>{col.label}</TH>
                  ))}
                </TR>
              </THead>
              <TBody>
                {transactions.items.map((txn) => (
                  <TransactionRow
                    key={txn.id}
                    transaction={txn}
                    activeColumns={activeColumns}
                  />
                ))}
              </TBody>
            </Table>

            {/* Pagination Loading State */}
            {isLoading && (
              <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
                Loading...
              </div>
            )}

            {/* End of Data State */}
            {!transactions.hasMore && transactions.items.length > 0 && (
              <div className="p-6 text-center text-[10px] text-gray-600 uppercase tracking-[0.2em]">
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
