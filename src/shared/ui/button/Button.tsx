import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/clsx';
import { Spinner } from '../spinner/Spinner';

/**
 * Props for the Reusable Button.
 */
interface ButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Reusable Button component with Framer Motion animations.
 */
export const Button = ({
  children,
  isLoading,
  variant = 'primary',
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      'bg-brand-primary text-surface-100 shadow-brand-glow hover:opacity-90',
    secondary:
      'bg-glass-bg border border-glass-border text-surface-100 hover:bg-glass-hover',
    outline:
      'bg-transparent border border-glass-border text-surface-200 hover:text-surface-100 hover:bg-glass-hover',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || disabled}
      className={cn(
        'relative w-full pointer-events-auto py-3 px-6 rounded-xl font-bold transition-all duration-300',
        'flex justify-center items-center gap-2 overflow-hidden',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner message="Processing" /> : children}
    </motion.button>
  );
};

Button.displayName = 'Button';
