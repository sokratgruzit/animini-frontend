import { motion } from 'framer-motion';

/**
 * Fullscreen Preloader with smooth Framer Motion transitions.
 * Used during initial app initialization and auth checks.
 */
export const LoadingScreen = () => {
  return (
    <motion.div
      // Smooth fade-out when component is unmounted
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#020617]"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 border-t-2 border-b-2 border-indigo-500 rounded-full"
        />

        {/* Animated inner pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-12 h-12 bg-indigo-600/30 rounded-full blur-xl"
        />

        {/* Center core */}
        <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_#fff]" />
      </div>

      {/* Loading text with staggered dots animation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-indigo-300 text-xs uppercase tracking-[0.3em] font-medium"
      >
        Initializing System
      </motion.p>
    </motion.div>
  );
};
