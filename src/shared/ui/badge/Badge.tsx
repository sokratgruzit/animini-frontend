import { type ReactNode, type MouseEvent } from 'react';
import { cn } from '../../lib/clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'danger';
  icon?: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}

export const Badge = ({
  children,
  variant = 'primary',
  icon,
  className,
  onClick,
}: BadgeProps) => {
  const variants = {
    primary: 'text-brand-primary border-brand-primary/30 bg-dark-base/80',
    glass: 'text-surface-300 border-glass-border bg-white/5',
    danger: 'text-brand-danger border-brand-danger/30 bg-brand-danger/10',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        /* FIXED: Added w-fit, shrink-0 and inline-flex to prevent stretching */
        'w-fit shrink-0 inline-flex items-center gap-1.5',
        'px-2 py-1 text-[10px] font-black uppercase tracking-wider',
        'backdrop-blur-md border rounded shadow-xl transition-all',
        onClick &&
          'cursor-pointer hover:bg-white/10 active:scale-95 select-none',
        variants[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate whitespace-nowrap">{children}</span>
    </Component>
  );
};
