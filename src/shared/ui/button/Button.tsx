import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/clsx";

/**
 * Props for the Reusable Button.
 * We extend HTMLMotionProps instead of React.ButtonHTMLAttributes
 * to avoid type conflicts with Framer Motion events.
 */
interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Reusable Button component with Framer Motion animations.
 * Features: Loading state, visual variants, and fluid interactions.
 */
export const Button = ({
  children,
  isLoading,
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-white/10 hover:bg-white/15 text-gray-200",
    outline:
      "bg-transparent border border-white/10 hover:border-white/20 text-gray-300",
  };

  return (
    <motion.button
      // Interaction animations
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      // Prevent interactions during loading or when disabled
      disabled={isLoading || disabled}
      className={cn(
        "relative w-full py-3 px-6 rounded-xl font-bold transition-all duration-200",
        "flex justify-center items-center gap-2 overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      // Spread remaining motion and button props
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          {/* Animated spinner for loading state */}
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="opacity-70 font-medium">Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

Button.displayName = "Button";
