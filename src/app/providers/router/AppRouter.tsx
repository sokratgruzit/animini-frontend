import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthPage, DashboardPage, ActivatePage } from '../../../pages';
import { type RootState } from '../../store';
import { ROUTES } from '../../../shared/config/routes';
import { AuthLayout } from './ui/AuthLayout';
import { MainLayout } from './ui/MainLayout'; // Added import

export const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: ROUTES.AUTH,
          element: isAuth ? <Navigate to={ROUTES.DASHBOARD} /> : <AuthPage />,
        },
        {
          path: ROUTES.ACTIVATE,
          element: <ActivatePage />,
        },
      ],
    },
    {
      // Using MainLayout for protected Dashboard
      element: isAuth ? <MainLayout /> : <Navigate to={ROUTES.AUTH} />,
      children: [
        {
          path: ROUTES.DASHBOARD,
          element: <DashboardPage />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={ROUTES.DASHBOARD} />,
    },
  ]);

  return <RouterProvider router={router} />;
};
