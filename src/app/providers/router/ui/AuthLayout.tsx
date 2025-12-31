import { Outlet } from 'react-router-dom';
import { BackgroundCanvas } from '../../../../shared/ui';

/**
 * AuthLayout Component.
 * Wraps public pages with the 3D Background Canvas.
 */
export const AuthLayout = () => {
  return (
    <>
      <BackgroundCanvas />
      {/* Outlet renders the child route (AuthPage, ActivatePage, etc.) */}
      <div className="relative z-10 pointer-events-none">
        <Outlet />
      </div>
    </>
  );
};
