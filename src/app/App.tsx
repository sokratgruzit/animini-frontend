import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { type RootState } from './store';
import { AppRouter } from './providers/router';
import { checkAuth, logout } from '../entities/user'; // Added logout import

import { LoadingScreen } from '../shared/ui';

/**
 * Main Application Shell.
 * Orchestrates global initialization, 3D background, and routing.
 */
const App = () => {
  const dispatch = useDispatch();
  const isAppReady = useSelector((state: RootState) => state.user.isAppReady);

  useEffect(() => {
    /**
     * Real auth check on app initialization.
     */
    dispatch(checkAuth() as any);

    /**
     * Global listener for 401 Unauthorized status from API.
     * Triggers local logout to sync state with server session expiration.
     */
    const handleUnauthorized = () => {
      dispatch(logout());
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

      {/*
        Routing logic kicks in only when the app is initialized.
        AppRouter handles switching between AuthPage and Dashboard.
      */}
      {isAppReady && <AppRouter />}
    </>
  );
};

export default App;
