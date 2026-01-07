import { type RootState } from '../../../app/store';

/**
 * Basic data selector
 */
export const selectUserData = (state: RootState) => state.user.data;

/**
 * Access user roles directly
 */
export const selectUserRoles = (state: RootState) =>
  state.user.data?.roles || [];

/**
 * Specific role checks (memoized logic)
 */
export const selectIsAuthor = (state: RootState) =>
  state.user.data?.roles.includes('AUTHOR') || false;

export const selectIsCritic = (state: RootState) =>
  state.user.data?.roles.includes('CRITIC') || false;

/**
 * Admin check for higher permissions
 */
export const selectIsAdmin = (state: RootState) =>
  state.user.data?.isAdmin || false;
