import { AUTH_USER_SET, AUTH_USER_CLEAR, AUTH_USER_UPDATE } from './types';

export const setAuthUserAction = (authUser) => ({ type: AUTH_USER_SET, authUser });
export const clearAuthUserAction = () => ({ type: AUTH_USER_CLEAR });
export const updateAuthUserAction = (payload) => ({ type: AUTH_USER_UPDATE, payload });
