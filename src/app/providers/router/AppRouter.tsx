import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AuthPage,
  DashboardPage,
  ActivatePage,
  WalletPage,
  AuthorPage,
  AuthorSeriesDetailsPage,
  DiscoverPage,
  PublicSeriesPage, // Added
} from '../../../pages';
import { type RootState } from '../../store';
import { ROUTES } from '../../../shared/config/routes';
import { AuthLayout } from './ui/AuthLayout';
import { MainLayout } from './ui/MainLayout';
import { RoleGuard } from './ui/RoleGuard';

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
      element: isAuth ? <MainLayout /> : <Navigate to={ROUTES.AUTH} />,
      children: [
        {
          path: ROUTES.DASHBOARD,
          element: <DashboardPage />,
        },
        // NEW: Public Discover Feed
        {
          path: ROUTES.DISCOVER,
          element: <DiscoverPage />,
        },
        // NEW: Public Series View (Full Player Implementation)
        {
          path: ROUTES.PUBLIC_SERIES_DETAILS,
          element: <PublicSeriesPage />,
        },
        {
          path: ROUTES.WALLET,
          element: <WalletPage />,
        },
        {
          element: <RoleGuard allowedRoles={['AUTHOR']} />,
          children: [
            {
              path: ROUTES.AUTHOR,
              element: <AuthorPage />,
            },
            {
              path: ROUTES.AUTHOR_SERIES_DETAILS,
              element: <AuthorSeriesDetailsPage />,
            },
          ],
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
