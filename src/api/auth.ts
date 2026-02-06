import { apiClient } from '@/lib/axios';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  AuthUser,
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/types/auth';
import type { AxiosError } from 'axios';

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
  const res = await apiClient.post<{ user: AuthUser }>(ENDPOINTS.AUTH.SIGNUP, data);
  return res.data;
}

export async function login(data: LoginInput): Promise<{ user: AuthUser }> {
  const res = await apiClient.post<{ user: AuthUser }>(ENDPOINTS.AUTH.LOGIN, data);
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
}

export async function refresh(): Promise<{ user: AuthUser; accessToken: string; refreshToken: string } | null> {
  try {
    const res = await apiClient.post<{ user: AuthUser }>(ENDPOINTS.AUTH.REFRESH);
    return { user: res.data.user, accessToken: '', refreshToken: '' };
  } catch {
    return null;
  }
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME);
  return res.data;
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<void> {
  await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
}

export async function resetPassword(data: ResetPasswordInput): Promise<void> {
  await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
}

export { toAuthError };
