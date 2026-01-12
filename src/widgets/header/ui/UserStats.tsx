import { IoDiamondOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { useWallet } from '../../../entities/wallet';

export const UserStats = () => {
  const { balance, reputation, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="animate-pulse h-12 w-48 mx-auto bg-glass-bg/50 rounded-xl border border-glass-border" />
    );
  }

  return (
    /* 
      Added w-fit (width based on content) 
      Added mx-auto (centers the block horizontally)
    */
    <div className="w-fit mx-auto flex items-center gap-4 px-5 py-2 bg-glass-bg border border-glass-border rounded-xl shadow-lg transition-all hover:border-brand-primary/30">
      {/* Balance Section */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary/10">
          <IoDiamondOutline className="text-brand-primary" size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 leading-none">
            Balance
          </span>
          <span className="text-sm font-black text-surface-100 tracking-tight leading-tight">
            {balance.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="w-px h-8 bg-glass-border" />

      {/* Reputation Section */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-success/10">
          <IoShieldCheckmarkOutline className="text-brand-success" size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 leading-none">
            Reputation
          </span>
          <span className="text-sm font-black text-surface-100 tracking-tight leading-tight">
            {reputation}
          </span>
        </div>
      </div>
    </div>
  );
};
