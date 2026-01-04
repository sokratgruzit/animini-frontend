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
  const renderCellContent = (id: WalletColumnId) => {
    switch (id) {
      case 'id':
        return (
          <span className="font-mono text-micro text-surface-300">
            {transaction.id.slice(0, 8)}
          </span>
        );

      case 'type':
        return (
          <span className="font-medium text-surface-100 capitalize">
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
              isPositive ? 'text-brand-success' : 'text-brand-danger'
            )}
          >
            {isPositive ? '+' : '-'}
            {transaction.amount.toLocaleString()}
          </span>
        );

      case 'date':
        return (
          <span className="text-surface-300 text-micro">
            {new Date(transaction.createdAt).toLocaleDateString()}
          </span>
        );

      case 'status':
        return (
          <span
            className={cn(
              'text-micro font-black uppercase tracking-super-wide',
              transaction.status === 'COMPLETED' && 'text-brand-success',
              transaction.status === 'PENDING' && 'text-brand-warning',
              transaction.status === 'FAILED' && 'text-brand-danger'
            )}
          >
            {transaction.status}
          </span>
        );

      case 'balance_after':
        return (
          <span className="text-surface-300 text-micro italic opacity-50">
            —
          </span>
        );

      case 'recipient':
        return <span className="text-surface-200 text-micro">System</span>;

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
