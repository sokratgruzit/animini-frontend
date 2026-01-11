import { cn } from '../../lib/clsx';

interface ProgressBarProps {
  progress: number;
  label?: string;
  subLabel?: string;
  variant?: 'primary' | 'success';
  size?: 'sm' | 'md';
  className?: string;
  showInfo?: boolean;
}

/**
 * Universal Progress Bar with branded glow effects.
 */
export const ProgressBar = ({
  progress,
  label,
  subLabel,
  variant = 'primary',
  size = 'sm',
  className,
  showInfo = true,
}: ProgressBarProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const barHeights = {
    sm: 'h-1',
    md: 'h-1.5',
  };

  const glows = {
    primary: 'shadow-[0_0_12px_rgba(99,102,241,0.6)] bg-brand-primary',
    success: 'shadow-[0_0_12px_rgba(34,197,94,0.6)] bg-green-500',
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {showInfo && (label || subLabel) && (
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-surface-400">{label}</span>
          <span className="text-brand-primary">
            {subLabel || `${safeProgress}%`}
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full bg-glass-border rounded-full overflow-hidden',
          barHeights[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            glows[variant]
          )}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
