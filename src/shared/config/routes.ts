/**
 * Application route paths constants
 */
export const ROUTES = {
  // Public
  AUTH: '/auth',
  DISCOVER: '/discover', // Main Feed
  PUBLIC_SERIES_DETAILS: '/series/:id', // Public view with player

  // Private
  DASHBOARD: '/',
  WALLET: '/wallet',
  ACTIVATE: '/activate/:link',

  // Author Workspace
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
