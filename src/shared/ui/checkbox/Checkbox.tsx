import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/clsx";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Custom styled checkbox with an SVG checkmark visible on :checked state
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group w-fit">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              "peer w-5 h-5 rounded-md border-2 border-white/20 bg-white/5 appearance-none transition-all",
              "checked:bg-indigo-600 checked:border-indigo-600 cursor-pointer",
              "focus:ring-2 focus:ring-indigo-500/50 outline-none",
              className
            )}
            {...props}
          />
          {/* SVG Checkmark icon - visible only when peer (input) is checked */}
          <svg
            className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
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
          <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
