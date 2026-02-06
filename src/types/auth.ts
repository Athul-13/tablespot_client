export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ValidationErrorResponse {
  error: string;
  details?: Record<string, string[] | undefined>;
}
