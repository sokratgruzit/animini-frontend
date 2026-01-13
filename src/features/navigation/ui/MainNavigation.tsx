import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../shared/ui';
import { cn } from '../../../shared/lib/clsx';
import { closePanel } from '../../panel';
import { MAIN_NAV_ITEMS } from '../../../shared/config/navigation';
import { selectUserRoles } from '../../../entities/user/model/selectors';

/**
 * Enhanced Main Navigation feature.
 * Automatically handles Discover route and Role-based filtering.
 */
export const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userRoles = useSelector(selectUserRoles);

  const handleNavClick = (path: string) => {
    navigate(path);
    dispatch(closePanel('left'));
  };

  const filteredNavItems = MAIN_NAV_ITEMS.filter((item) => {
    if (!item.requiredRole) return true;
    return userRoles.includes(item.requiredRole);
  });

  return (
    <nav className="flex flex-col gap-2">
      <div className="px-3 mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-500 opacity-50">
          Navigation Matrix
        </span>
      </div>

      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => handleNavClick(item.path)}
            className={cn(
              'justify-start gap-4 h-12 border-transparent transition-all duration-300 rounded-xl',
              isActive
                ? 'bg-brand-primary/10 text-brand-primary border-r-2 border-r-brand-primary'
                : 'text-surface-300 hover:bg-glass-bg hover:text-surface-100'
            )}
          >
            <Icon
              size={20}
              className={cn(
                'shrink-0 transition-colors',
                isActive ? 'text-brand-primary' : 'text-surface-400'
              )}
            />
            <span className="text-xs font-black uppercase tracking-widest">
              {item.title}
            </span>
          </Button>
        );
      })}
    </nav>
  );
};
