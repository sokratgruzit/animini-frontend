import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/clsx';

/**
 * Props for the custom Input component.
 * label: optional text above the input.
 * error: optional validation error message.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Reusable Input component with forwardRef for react-hook-form integration.
 * Styled with Tailwind CSS for a modern, dark-themed UI.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Render label if provided */}
        {label && (
          <label className="text-sm font-medium text-gray-400 ml-1">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={cn(
            // Base styles
            'px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200',
            'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-gray-600 text-white',
            // Error styles
            error &&
              'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
            className
          )}
          {...props}
        />

        {/* Render error message if provided */}
        {error && (
          <span className="text-xs text-red-500 mt-1 ml-1 font-medium italic">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
