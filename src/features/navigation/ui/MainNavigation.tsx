import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../shared/ui';
import { cn } from '../../../shared/lib/clsx';
import { closePanel } from '../../panel';
import { MAIN_NAV_ITEMS } from '../../../shared/config/navigation';
import { selectUserRoles } from '../../../entities/user/model/selectors';

export const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get current user roles from state
  const userRoles = useSelector(selectUserRoles);

  const handleNavClick = (path: string) => {
    navigate(path);
    dispatch(closePanel('left'));
  };

  // Filter items based on requiredRole and user permissions
  const filteredNavItems = MAIN_NAV_ITEMS.filter((item) => {
    if (!item.requiredRole) return true;
    return userRoles.includes(item.requiredRole);
  });

  return (
    <nav className="flex flex-col gap-2">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => handleNavClick(item.path)}
            className={cn(
              'justify-start gap-3 border-transparent transition-all duration-300',
              isActive
                ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                : 'text-surface-300 hover:bg-glass-hover hover:text-surface-100'
            )}
          >
            <Icon
              size={20}
              className={isActive ? 'text-brand-primary' : 'transition-colors'}
            />
            <span className="font-medium">{item.title}</span>
          </Button>
        );
      })}
    </nav>
  );
};
