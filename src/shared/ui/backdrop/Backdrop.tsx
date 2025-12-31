import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '../../lib/clsx';

interface BackdropProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable Backdrop component for modals and overlays.
 * Uses Framer Motion for smooth fade-in/out effects.
 */
export const Backdrop = ({ children, className, onClick }: BackdropProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
