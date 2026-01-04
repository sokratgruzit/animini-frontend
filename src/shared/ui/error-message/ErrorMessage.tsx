import { motion } from 'framer-motion';
import { BiErrorCircle } from 'react-icons/bi';

interface ErrorMessageProps {
  message?: string;
}

/**
 * Animated error block for form-level or page-level errors
 * Uses react-icons as per the project stack
 */
export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 p-3 rounded-lg bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-sm pointer-events-auto"
    >
      <BiErrorCircle size={18} className="shrink-0" />
      <span className="font-medium tracking-tight">{message}</span>
    </motion.div>
  );
};
