import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert, Snackbar } from '@mui/material';

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
}

type Severity = 'success' | 'error' | 'info' | 'warning';

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastState {
  open: boolean;
  message: string;
  severity: Severity;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const show = useCallback((message: string, severity: Severity) => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: {
        success: (message) => show(message, 'success'),
        error: (message) => show(message, 'error'),
        info: (message) => show(message, 'info'),
        warning: (message) => show(message, 'warning'),
      },
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

// Same pattern as AuthContext: one file with provider + hook to avoid resolution issues (e.g. ToastContext vs toastContext on case-insensitive FS).
// eslint-disable-next-line react-refresh/only-export-components -- useToast is a hook, not a component; keeping in same file is intentional.
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
