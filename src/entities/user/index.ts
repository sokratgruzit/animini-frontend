/**
 * Public API for the User entity
 */

// Export actions from the slice
export { setAuth, logout, setAppReady } from "./model/slice";

// Export types
export type { RootState, AppDispatch } from "../../app/store";
