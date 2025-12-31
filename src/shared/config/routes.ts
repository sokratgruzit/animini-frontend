/**
 * Application route paths constants
 */
export const ROUTES = {
  AUTH: '/auth',
  DASHBOARD: '/',
} as const;

/**
 * Helper type to use route values in functions
 */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
