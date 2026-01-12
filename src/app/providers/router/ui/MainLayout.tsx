import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { IoMenu, IoLogOutOutline } from 'react-icons/io5';
import { ROUTES } from '../../../../shared/config/routes';
import type { RootState, AppDispatch } from '../../../store';
import {
  closePanel,
  togglePanel,
  type PanelSide,
  type PanelContent as PanelContentType,
} from '../../../../features/panel';
import {
  userLogout,
  VerificationBanner,
  selectUserData,
} from '../../../../entities/user';
import {
  PanelRoot,
  PanelHeader,
  PanelContent,
  Button,
} from '../../../../shared/ui';
import { MainNavigation } from '../../../../features/navigation/ui';
import { DepositWidget } from '../../../../features/wallet/ui';
import { cn } from '../../../../shared/lib/clsx';

const getPageTitle = (pathname: string): string => {
  if (pathname === ROUTES.DASHBOARD) return 'Dashboard';
  if (pathname === ROUTES.WALLET) return 'My Wallet';
  if (pathname === ROUTES.AUTHOR) return 'Author Workspace';
  return '';
};

const panelContentMap: Record<
  NonNullable<PanelContentType>,
  React.ReactNode
> = {
  navigation: <MainNavigation />,
  wallet: <DepositWidget />,
  settings: <div>Settings Widget</div>,
  'anime-list': <div>Anime List Widget</div>,
  notifications: <div>Notifications</div>,
};

export const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const panels = useSelector((state: RootState) => state.panel.panels);
  const user = useSelector(selectUserData);

  const pageTitle = getPageTitle(location.pathname);
  const isUnverified = user && !user.emailVerified;

  const handleClose = (side: PanelSide) => {
    dispatch(closePanel(side));
  };

  return (
    <div className="relative flex min-h-screen bg-dark-base text-surface-100 overflow-hidden">
      {/* 1. Fixed Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 z-40 px-6 flex items-center bg-dark-base/60 backdrop-blur-xl border-b border-glass-border">
        <div className="flex items-center gap-6">
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(togglePanel({ side: 'left', content: 'navigation' }));
            }}
            className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-glass-bg border-glass-border shadow-lg"
          >
            <IoMenu size={24} className="text-brand-primary" />
          </Button>

          <h1 className="text-3xl font-black text-surface-100 tracking-tight uppercase">
            {pageTitle}
          </h1>
        </div>
      </header>

      {/* 2. Dynamic Panels Rendering */}
      {(Object.keys(panels) as PanelSide[]).map((side) => {
        const { isOpen, content } = panels[side];
        return (
          <PanelRoot
            key={side}
            side={side}
            isOpen={isOpen}
            onClose={() => handleClose(side)}
          >
            {content && (
              <>
                <PanelHeader
                  title={content.charAt(0).toUpperCase() + content.slice(1)}
                  onClose={() => handleClose(side)}
                />
                <PanelContent className="flex flex-col h-full">
                  <div className="flex-1">{panelContentMap[content]}</div>
                  {content === 'navigation' && (
                    <div className="mt-auto pt-6 border-t border-glass-border">
                      <Button
                        variant="outline"
                        onClick={() => dispatch(userLogout())}
                        className="justify-start gap-3 border-transparent text-brand-danger hover:bg-brand-danger/10 transition-all"
                      >
                        <IoLogOutOutline size={20} />
                        <span>Logout</span>
                      </Button>
                    </div>
                  )}
                </PanelContent>
              </>
            )}
          </PanelRoot>
        );
      })}

      {/* 3. Main Content Canvas */}
      <main
        className={cn(
          'flex-1 relative w-full h-screen overflow-auto pb-10 transition-all duration-300',
          // FIXED: Adjusted padding for vertical mobile banner (pt-64) and desktop (pt-44)
          isUnverified ? 'pt-64 md:pt-44' : 'pt-20'
        )}
      >
        <VerificationBanner />

        <div className="px-6 pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
