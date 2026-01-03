import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '../../../shared/ui';
import { cn } from '../../../shared/lib/clsx';
import { closePanel } from '../../panel';
import { MAIN_NAV_ITEMS } from '../../../shared/config/navigation';

export const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleNavClick = (path: string) => {
    navigate(path);
    dispatch(closePanel('left'));
  };

  return (
    <nav className="flex flex-col gap-2">
      {MAIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => handleNavClick(item.path)}
            className={cn(
              'justify-start gap-3 border-transparent transition-all',
              isActive
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon size={20} className={isActive ? 'text-indigo-400' : ''} />
            <span className="font-medium">{item.title}</span>
          </Button>
        );
      })}
    </nav>
  );
};
