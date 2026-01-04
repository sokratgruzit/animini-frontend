import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { type RootState, type AppDispatch } from './store';
import { AppRouter } from './providers/router';
/**
 * Import checkAuth and resetUserState.
 * resetUserState is used for immediate local cleanup.
 */
import { checkAuth, resetUserState } from '../entities/user';

import { LoadingScreen } from '../shared/ui';

/**
 * Main Application Shell.
 * Orchestrates global initialization, 3D background, and routing.
 */
const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAppReady = useSelector((state: RootState) => state.user.isAppReady);

  useEffect(() => {
    /**
     * Real auth check on app initialization.
     */
    dispatch(checkAuth());

    /**
     * Global listener for 401 Unauthorized status from API.
     * Triggers synchronous local state reset to sync with server session expiration.
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

      {/*
        Routing logic kicks in only when the app is initialized.
        AppRouter handles switching between AuthPage and Dashboard.
      */}
      {isAppReady && <AppRouter />}
    </>
  );
};

export default App;
