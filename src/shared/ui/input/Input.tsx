import { forwardRef, type InputHTMLAttributes, useRef } from 'react';
import { cn } from '../../lib/clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  step?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, step = 1, min, max, ...props }, ref) => {
    const isNumber = type === 'number';
    const internalRef = useRef<HTMLInputElement | null>(null);

    const adjustValue = (delta: number) => {
      const input = internalRef.current;
      if (!input) return;

      const currentValue = parseFloat(input.value) || 0;
      let newValue = currentValue + delta;

      /**
       * Constrain value within min and max limits if they are provided
       */
      if (min !== undefined) {
        newValue = Math.max(Number(min), newValue);
      }
      if (max !== undefined) {
        newValue = Math.min(Number(max), newValue);
      }

      input.value = newValue.toString();

      // Trigger synthetic events for external libraries (e.g., react-hook-form)
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);

      if (props.onChange) {
        props.onChange({
          target: input,
          currentTarget: input,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="flex flex-col gap-1.5 w-full pointer-events-auto">
        {label && (
          <label className="text-micro font-black uppercase tracking-super-wide text-surface-300 ml-1">
            {label}
          </label>
        )}

        <div className="relative group">
          <input
            {...props}
            type={type}
            min={min}
            max={max}
            ref={(node) => {
              internalRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            className={cn(
              'px-4 py-3 bg-glass-bg border border-glass-border rounded-xl outline-none transition-all duration-300 w-full',
              'placeholder:text-surface-300/50 text-surface-100',
              'focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              error &&
                'border-brand-danger/50 focus:border-brand-danger focus:ring-brand-danger/40',
              isNumber && 'pr-12',
              className
            )}
          />

          {isNumber && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => adjustValue(step)}
                className="p-1 hover:text-brand-primary text-surface-300 transition-colors"
                tabIndex={-1}
              >
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M1 5L5 1L9 5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => adjustValue(-step)}
                className="p-1 hover:text-brand-primary text-surface-300 transition-colors"
                tabIndex={-1}
              >
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {error && (
          <span className="text-micro font-bold text-brand-danger mt-1 ml-1 uppercase tracking-wider">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
