import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/clsx';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Custom styled checkbox with an SVG checkmark visible on :checked state
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group w-fit pointer-events-auto">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'peer w-5 h-5 rounded-md border border-glass-border bg-glass-bg appearance-none transition-all duration-300',
              'checked:bg-brand-primary checked:border-brand-primary cursor-pointer',
              'focus:ring-2 focus:ring-brand-primary/40 outline-none',
              className
            )}
            {...props}
          />
          {/* SVG Checkmark icon - visible only when peer (input) is checked */}
          <svg
            className="absolute w-3.5 h-3.5 text-surface-100 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
            xmlns="www.w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {label && (
          <span className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
