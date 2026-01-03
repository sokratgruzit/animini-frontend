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
  iconColor = 'text-indigo-500',
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-between h-12 px-4 pt-2',
        'bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl',
        'min-w-40 transition-all',
        className
      )}
    >
      {/* Title in top-left corner */}
      <span className="absolute top-1.5 left-4 text-[10px] text-gray-500 uppercase font-bold tracking-tighter leading-none">
        {title}
      </span>

      {/* Content row: Icon left, Value right */}
      <div className="flex items-center w-full justify-between mt-1">
        <Icon size={20} className={iconColor} />
        <p className="text-lg font-bold text-white leading-none">{value}</p>
      </div>
    </div>
  );
};
