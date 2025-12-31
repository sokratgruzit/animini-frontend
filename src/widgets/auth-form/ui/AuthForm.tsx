import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card } from '../../../shared/ui';
import { LoginForm } from '../../../features/login-by-email';
import { RegisterForm } from '../../../features/auth-by-email';

/**
 * AuthForm Widget.
 * Orchestrates Login and Registration features with smooth animations.
 */
export const AuthForm = () => {
  // 'login' or 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () =>
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));

  return (
    <Card className="w-full max-w-md relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {mode === 'login' ? (
          <motion.div
            key="login"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <LoginForm onFlip={toggleMode} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <RegisterForm onFlip={toggleMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
