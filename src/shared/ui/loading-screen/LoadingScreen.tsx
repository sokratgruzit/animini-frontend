import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Flexible Fullscreen Preloader.
 * Accepts an optional message to display different loading states.
 */
export const LoadingScreen = ({
  message = 'Initializing System',
}: LoadingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-dark-base"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 border-t-2 border-b-2 border-brand-primary rounded-full shadow-brand-glow"
        />

        {/* Animated inner pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-12 h-12 bg-brand-primary/30 rounded-full blur-xl"
        />

        {/* Center core */}
        <div className="absolute w-1.5 h-1.5 bg-surface-100 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Dynamic message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-brand-primary text-micro font-black uppercase tracking-super-wide"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};
