import { apiClient } from '@/lib/axios';
import type {
  AuthUser,
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/types/auth';
import type { AxiosError } from 'axios';

const AUTH_BASE = '/auth';

export interface AuthApiError {
  message: string;
  statusCode: number;
  details?: Record<string, string[] | undefined>;
}

function toAuthError(err: unknown): AuthApiError {
  const axiosError = err as AxiosError<{ error?: string; details?: Record<string, string[] | undefined> }>;
  const status = axiosError.response?.status ?? 500;
  const data = axiosError.response?.data;
  const message = data?.error ?? axiosError.message ?? 'Something went wrong';
  return {
    message,
    statusCode: status,
    details: data?.details,
  };
}

export async function signup(data: SignupInput): Promise<{ user: AuthUser }> {
  const res = await apiClient.post<{ user: AuthUser }>(`${AUTH_BASE}/signup`, data);
  return res.data;
}

export async function login(data: LoginInput): Promise<{ user: AuthUser }> {
  const res = await apiClient.post<{ user: AuthUser }>(`${AUTH_BASE}/login`, data);
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout`);
}

export async function refresh(): Promise<{ user: AuthUser; accessToken: string; refreshToken: string } | null> {
  try {
    const res = await apiClient.post<{ user: AuthUser }>(`${AUTH_BASE}/refresh`);
    return { user: res.data.user, accessToken: '', refreshToken: '' };
  } catch {
    return null;
  }
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiClient.get<AuthUser>(`${AUTH_BASE}/me`);
  return res.data;
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/forgot-password`, data);
}

export async function resetPassword(data: ResetPasswordInput): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/reset-password`, data);
}

export { toAuthError };
