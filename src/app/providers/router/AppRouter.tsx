import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthPage } from '../../../pages';
import { type RootState } from '../../store';
import { ROUTES } from '../../../shared/config/routes';

/**
 * Main Router component.
 * Handles public and protected route logic.
 */
export const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  const router = createBrowserRouter([
    {
      path: ROUTES.AUTH,
      // If user is already logged in, redirect away from Auth page to Dashboard
      element: isAuth ? <Navigate to={ROUTES.DASHBOARD} /> : <AuthPage />,
    },
    {
      path: ROUTES.DASHBOARD,
      // Basic protection: if not logged in, redirect to Auth
      element: isAuth ? (
        <div className="text-white">Dashboard Placeholder</div>
      ) : (
        <Navigate to={ROUTES.AUTH} />
      ),
    },
    {
      path: '*',
      element: <Navigate to={ROUTES.DASHBOARD} />,
    },
  ]);

  return <RouterProvider router={router} />;
};
