import type { IconType } from 'react-icons'; // Import the specific type
import {
  IoGridOutline,
  IoWalletOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { ROUTES } from './routes';

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: IconType; // Changed from ElementType to IconType
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: IoGridOutline,
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
