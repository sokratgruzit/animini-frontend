import { type ReactNode } from 'react';
import { cn } from '../../lib/clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'danger';
  icon?: ReactNode;
  className?: string;
}

/**
 * Universal Badge component for statuses, counters, and labels.
 */
export const Badge = ({
  children,
  variant = 'primary',
  icon,
  className,
}: BadgeProps) => {
  const variants = {
    primary: 'text-brand-primary border-brand-primary/30 bg-dark-base/80',
    glass: 'text-surface-300 border-glass-border bg-white/5',
    danger: 'text-brand-danger border-brand-danger/30 bg-brand-danger/10',
  };

  return (
    <div
      className={cn(
        'px-2 py-1 text-[10px] font-black uppercase tracking-wider',
        'backdrop-blur-md border rounded shadow-xl flex items-center gap-1.5',
        variants[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  );
};
