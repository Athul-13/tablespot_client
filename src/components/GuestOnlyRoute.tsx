import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface GuestOnlyRouteProps {
  children: React.ReactNode;
  /** Where to send logged-in users. Defaults to landing page. */
  redirectTo?: string;
}

export function GuestOnlyRoute({ children, redirectTo = '/' }: GuestOnlyRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
