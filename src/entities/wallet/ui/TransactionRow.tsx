import type { Transaction } from '../model/types';
import { TR, TD } from '../../../shared/ui/table/Table';
import type { WalletColumnId } from '../../../shared/config/columns';
import { cn } from '../../../shared/lib/clsx';

interface TransactionRowProps {
  transaction: Transaction;
  activeColumns: WalletColumnId[];
}

export const TransactionRow = ({
  transaction,
  activeColumns,
}: TransactionRowProps) => {
  // Mapper logic to render content based on Column ID
  const renderCellContent = (id: WalletColumnId) => {
    switch (id) {
      case 'id':
        return (
          <span className="font-mono text-xs opacity-40">
            {transaction.id.slice(0, 8)}
          </span>
        );

      case 'type':
        return (
          <span className="font-medium text-white/90">
            {transaction.type.replace('_', ' ')}
          </span>
        );

      case 'amount':
        const isPositive = [
          'deposit',
          'author_payout',
          'critic_reward',
        ].includes(transaction.type);
        return (
          <span
            className={cn(
              'font-bold tracking-tight',
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {isPositive ? '+' : '-'}
            {transaction.amount.toLocaleString()}
          </span>
        );

      case 'date':
        return (
          <span className="text-gray-500 text-xs">
            {new Date(transaction.timestamp).toLocaleDateString()}
          </span>
        );

      case 'status':
        return (
          <span
            className={cn(
              'text-[10px] font-black uppercase tracking-wider',
              transaction.status === 'completed' && 'text-emerald-500',
              transaction.status === 'pending' && 'text-amber-500',
              transaction.status === 'failed' && 'text-rose-500'
            )}
          >
            {transaction.status}
          </span>
        );

      case 'balance_after':
        return (
          <span className="text-gray-400 text-xs italic">Coming soon</span>
        );

      case 'recipient':
        return <span className="text-gray-400 text-xs italic">System</span>;

      default:
        return null;
    }
  };

  return (
    <TR>
      {activeColumns.map((colId) => (
        <TD key={colId}>{renderCellContent(colId)}</TD>
      ))}
    </TR>
  );
};
