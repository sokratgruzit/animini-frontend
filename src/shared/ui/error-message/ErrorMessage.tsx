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
      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
    >
      <BiErrorCircle size={18} />
      <span>{message}</span>
    </motion.div>
  );
};
