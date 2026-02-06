/**
 * Centralized API endpoint paths.
 * Use these constants everywhere instead of hardcoding URLs.
 */

const AUTH = '/auth' as const;

export const ENDPOINTS = {
  AUTH: {
    BASE: AUTH,
    SIGNUP: `${AUTH}/signup`,
    LOGIN: `${AUTH}/login`,
    LOGOUT: `${AUTH}/logout`,
    REFRESH: `${AUTH}/refresh`,
    ME: `${AUTH}/me`,
    FORGOT_PASSWORD: `${AUTH}/forgot-password`,
    RESET_PASSWORD: `${AUTH}/reset-password`,
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
