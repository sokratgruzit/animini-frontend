export type WalletColumnId =
  | 'id'
  | 'type'
  | 'amount'
  | 'date'
  | 'status'
  | 'balance_after'
  | 'recipient';

export interface ColumnConfig {
  id: WalletColumnId;
  label: string;
  priority: number; // 1 - high (always show), 3 - low (hide first)
}

export const WALLET_COLUMNS: ColumnConfig[] = [
  { id: 'type', label: 'Operation', priority: 1 },
  { id: 'amount', label: 'Amount', priority: 1 },
  { id: 'status', label: 'Status', priority: 2 },
  { id: 'date', label: 'Date', priority: 2 },
  { id: 'id', label: 'Transaction ID', priority: 3 },
  { id: 'recipient', label: 'To/From', priority: 3 },
  { id: 'balance_after', label: 'Balance After', priority: 3 },
];
