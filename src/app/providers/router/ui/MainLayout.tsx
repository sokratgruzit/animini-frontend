import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { IoMenu, IoLogOutOutline } from 'react-icons/io5';
import type { RootState, AppDispatch } from '../../../store';
import {
  closePanel,
  togglePanel,
  type PanelSide,
  type PanelContent as PanelContentType,
} from '../../../../features/panel';
import { userLogout } from '../../../../entities/user';
import {
  PanelRoot,
  PanelHeader,
  PanelContent,
  Button,
} from '../../../../shared/ui';
import { MainNavigation } from '../../../../features/navigation/ui';
import { DepositWidget } from '../../../../features/wallet/ui';

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
  const panels = useSelector((state: RootState) => state.panel.panels);

  const handleClose = (side: PanelSide) => {
    dispatch(closePanel(side));
  };

  return (
    <div className="relative flex min-h-screen bg-dark-base text-surface-100 overflow-hidden">
      {/* 1. Global Navigation Trigger */}
      <div className="fixed top-6 left-6 z-40">
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(togglePanel({ side: 'left', content: 'navigation' }));
          }}
          className="w-12 h-12 p-0 flex items-center justify-center rounded-xl bg-glass-bg border-glass-border backdrop-blur-xl"
        >
          <IoMenu size={24} className="text-brand-primary" />
        </Button>
      </div>

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
      <main className="flex-1 relative w-full h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
