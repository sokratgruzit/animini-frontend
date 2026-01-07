import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUserRoles } from '../../../../entities/user/model/selectors';
import { ROUTES } from '../../../../shared/config/routes';

interface RoleGuardProps {
  allowedRoles: string[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const userRoles = useSelector(selectUserRoles);

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
