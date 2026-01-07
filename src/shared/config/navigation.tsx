import {
  IoGridOutline,
  IoWalletOutline,
  IoSettingsOutline,
  IoCreateOutline,
} from 'react-icons/io5';
import { ROUTES } from './routes';
import type { IconType } from 'react-icons';

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: IconType;
  requiredRole?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: IoGridOutline,
  },
  {
    id: 'author',
    title: 'Author Workspace',
    path: ROUTES.AUTHOR,
    icon: IoCreateOutline,
    requiredRole: 'AUTHOR',
  },
  {
    id: 'wallet',
    title: 'Wallet',
    path: ROUTES.WALLET,
    icon: IoWalletOutline,
  },
  {
    id: 'settings',
    title: 'Settings',
    path: ROUTES.DASHBOARD,
    icon: IoSettingsOutline,
  },
];
