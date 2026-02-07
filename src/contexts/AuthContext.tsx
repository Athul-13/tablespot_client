import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '@/api/auth';
import type { AuthUser, SignupInput } from '@/types/auth';
import type { AuthApiError } from '@/api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: AuthApiError }>;
  signup: (data: SignupInput) => Promise<{ success: boolean; error?: AuthApiError }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: AuthApiError }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: AuthApiError }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: AuthApiError }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadUser = useCallback(async () => {
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch (err) {
      const status = (err as { response?: { status: number } })?.response?.status;
      if (status === 401) {
        const refreshed = await authApi.refresh();
        if (refreshed) {
          try {
            const me = await authApi.getMe();
            setUser(me);
            return;
          } catch {
            setUser(null);
            return;
          }
        }
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const { user: u } = await authApi.login({ email, password });
        setUser(u);
        return { success: true };
      } catch (err) {
        const e = authApi.toAuthError(err);
        setError(e.message);
        return { success: false, error: e };
      }
    },
    []
  );

  const signup = useCallback(async (data: SignupInput) => {
    setError(null);
    try {
      await authApi.signup(data);
      // Do not set user — no session is created on signup; user must log in.
      return { success: true };
    } catch (err) {
      const e = authApi.toAuthError(err);
      setError(e.message);
      return { success: false, error: e };
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await authApi.forgotPassword({ email });
      return { success: true };
    } catch (err) {
      const e = authApi.toAuthError(err);
      setError(e.message);
      return { success: false, error: e };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setError(null);
    try {
      await authApi.resetPassword({ token, newPassword });
      return { success: true };
    } catch (err) {
      const e = authApi.toAuthError(err);
      setError(e.message);
      return { success: false, error: e };
    }
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setError(null);
      try {
        await authApi.changePassword(currentPassword, newPassword);
        return { success: true };
      } catch (err) {
        const e = authApi.toAuthError(err);
        setError(e.message);
        return { success: false, error: e };
      }
    },
    []
  );

  const value: AuthContextValue = {
    user,
    isLoading,
    error,
    clearError,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components 
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
