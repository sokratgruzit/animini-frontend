import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

import { type RootState } from "./store";
import { setAppReady } from "../entities/user/model/slice";

import { LoadingScreen, BackgroundCanvas } from "../shared/ui";
import { AuthPage } from "../pages";

const App = () => {
  const dispatch = useDispatch();
  const isAppReady = useSelector((state: RootState) => state.user.isAppReady);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setAppReady(true));
    }, 2500);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isAppReady && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <BackgroundCanvas />

      {isAppReady && <AuthPage />}
    </>
  );
};

export default App; // Экспортируем просто App
