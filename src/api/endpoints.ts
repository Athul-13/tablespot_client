/**
 * Centralized API endpoint paths.
 * Use these constants everywhere instead of hardcoding URLs.
 */

const AUTH = '/auth' as const;
const RESTAURANTS = '/restaurants' as const;

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
    CHANGE_PASSWORD: `${AUTH}/change-password`,
  },
  RESTAURANTS: {
    BASE: RESTAURANTS,
    LIST: RESTAURANTS,
    BY_ID: (id: string) => `${RESTAURANTS}/${id}`,
    COMMENTS: (restaurantId: string) => `${RESTAURANTS}/${restaurantId}/comments`,
    COMMENT: (restaurantId: string, commentId: string) =>
      `${RESTAURANTS}/${restaurantId}/comments/${commentId}`,
    RATINGS: (restaurantId: string) => `${RESTAURANTS}/${restaurantId}/ratings`,
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
