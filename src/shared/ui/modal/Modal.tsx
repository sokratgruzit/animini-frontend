import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../portal/Portal';
import { Backdrop } from '../backdrop/Backdrop';
import { Button } from '../button/Button';
import { IoCloseOutline } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Universal Modal using Shared UI components.
 */
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <Backdrop onClick={onClose}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl panel-glass rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Refactored to use your Button component */}
              <div className="absolute top-6 right-6 z-10">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
                >
                  <IoCloseOutline size={20} />
                </Button>
              </div>

              <div className="w-full">{children}</div>
            </motion.div>
          </Backdrop>
        </Portal>
      )}
    </AnimatePresence>
  );
};
