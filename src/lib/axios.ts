import axios, { type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { ENDPOINTS } from '@/api/endpoints';

/** Custom config to avoid refresh loop and control retry once */
declare module 'axios' {
  interface AxiosRequestConfig {
    /** When true, 401 response will not trigger refresh + retry (used for refresh endpoint itself). */
    skipAuthRefresh?: boolean;
    /** Internal: marks that this request is a retry after refresh. */
    _retried?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ——— Request interceptor ———
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any global request logic here (e.g. auth header from memory, request id).
    return config;
  },
  (error) => Promise.reject(error)
);

// ——— Response interceptor: 401 → refresh then retry once ———
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const is401 = error.response?.status === 401;
    const skipRefresh =
      originalRequest.skipAuthRefresh === true || originalRequest._retried === true;
    const isRefreshUrl =
      originalRequest.url?.endsWith(ENDPOINTS.AUTH.REFRESH) ?? false;

    if (is401 && !skipRefresh && !isRefreshUrl) {
      originalRequest._retried = true;
      try {
        await apiClient.post(ENDPOINTS.AUTH.REFRESH, undefined, {
          skipAuthRefresh: true,
        });
        return apiClient(originalRequest);
      } catch {
        // Refresh failed or rejected; let the original 401 propagate.
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
