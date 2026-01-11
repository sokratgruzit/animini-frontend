/**
 * Application route paths constants
 */
export const ROUTES = {
  AUTH: '/auth',
  DASHBOARD: '/',
  WALLET: '/wallet',
  ACTIVATE: '/activate/:link',
  AUTHOR: '/author',
  AUTHOR_SERIES_DETAILS: '/author/series/:id',
} as const;

/**
 * Helper type to use route values in functions
 */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Helper to generate dynamic paths
 */
export const getRouteWithId = (path: string, id: string) => {
  return path.replace(':id', id);
};
