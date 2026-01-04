import type { IconType } from 'react-icons';
import { cn } from '../../lib/clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  iconColor?: string;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-brand-primary',
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-between h-12 px-4 pt-2 pointer-events-auto',
        'panel-glass border-glass-border rounded-xl transition-all duration-300',
        'min-w-40',
        className
      )}
    >
      {/* Только заголовок: агрессивно мелкий через scale-50 */}
      <span className="absolute top-1 left-4 text-micro text-surface-300 font-bold uppercase tracking-tighter leading-none scale-50 origin-top-left select-none">
        {title}
      </span>

      <div className="flex items-center w-full justify-between mt-1">
        <Icon size={20} className={cn('shrink-0', iconColor)} />
        <p className="text-lg font-bold text-surface-100 leading-none tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};
