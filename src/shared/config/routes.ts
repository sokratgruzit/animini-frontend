/**
 * Application route paths constants
 */
export const ROUTES = {
  AUTH: '/auth',
  DASHBOARD: '/',
  WALLET: '/wallet',
  ACTIVATE: '/activate/:link',
  AUTHOR: '/author',
} as const;

/**
 * Helper type to use route values in functions
 */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
