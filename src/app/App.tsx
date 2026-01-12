import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { type RootState, type AppDispatch } from './store';
import { AppRouter } from './providers/router';
import { checkAuth, resetUserState } from '../entities/user';
import { useEventSubscriber } from '../shared/lib/hooks/useEventSubscriber';
import { LoadingScreen, Toaster } from '../shared/ui';

/**
 * Main Application Shell.
 * Orchestrates global initialization, real-time sync, and routing.
 */
const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAppReady = useSelector((state: RootState) => state.user.isAppReady);

  /**
   * 1. Establish real-time connection with the server.
   * This hook listens for global events (Auth updates, Wallet, etc.)
   */
  useEventSubscriber();

  useEffect(() => {
    /**
     * 2. Real auth check on app initialization.
     */
    dispatch(checkAuth());

    /**
     * 3. Global listener for 401 Unauthorized status from API.
     */
    const handleUnauthorized = () => {
      dispatch(resetUserState());
    };

    window.addEventListener('app:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('app:unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <>
      {/* Global preloader with exit animation support */}
      <AnimatePresence mode="wait">
        {!isAppReady && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {/* Main App content */}
      {isAppReady && <AppRouter />}

      {/* 
         Global Notification System.
         Fixed position at the bottom-right via shared styles.
      */}
      <Toaster />
    </>
  );
};

export default App;
