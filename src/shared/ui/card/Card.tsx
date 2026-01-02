import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/clsx';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

/**
 * Glassmorphism-style card container for forms and content blocks
 */
export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-black/5 pointer-events-auto backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
