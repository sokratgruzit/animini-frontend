import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '../../lib/clsx';
import { Backdrop } from '../backdrop/Backdrop';

interface PanelRootProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const PanelRoot = ({
  side = 'left',
  isOpen,
  onClose,
  children,
  className,
}: PanelRootProps) => {
  const variants = {
    initial: {
      x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
      y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0,
    },
    animate: { x: 0, y: 0 },
    exit: {
      x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
      y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0,
    },
  };

  const positionClasses = {
    left: 'top-0 left-0 h-full w-full md:w-80 md:border-r',
    right: 'top-0 right-0 h-full w-full md:w-80 md:border-l',
    top: 'top-0 left-0 w-full h-screen md:h-64 border-b',
    bottom: 'bottom-0 left-0 w-full h-screen md:h-64 border-t',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={onClose} className="z-50 pointer-events-auto" />

          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'fixed z-50 pointer-events-auto flex flex-col overflow-hidden shadow-2xl transition-all duration-300',
              'bg-dark-base md:panel-glass border-glass-border',
              positionClasses[side],
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
