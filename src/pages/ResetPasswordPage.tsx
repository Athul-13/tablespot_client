import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, error, clearError } = useAuth();
  const token = searchParams.get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitError(null);
    setConfirmError(null);
    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }
    const result = await resetPassword(token, newPassword);
    if (result.success) {
      navigate('/login', { replace: true, state: { message: 'Password reset successfully. You can log in now.' } });
      return;
    }
    setSubmitError(result.error?.message ?? 'Failed to reset password');
  };

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Invalid or missing reset link. Please request a new password reset from the login page.
            </Alert>
            <Button component={Link} to="/forgot-password" variant="contained">
              Forgot password
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reset password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your new password below.
          </Typography>
          {(error || submitError || confirmError) && (
            <Alert severity="error" onClose={() => { clearError(); setSubmitError(null); setConfirmError(null); }} sx={{ mb: 2 }}>
              {confirmError ?? submitError ?? error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="New password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={Boolean(confirmError)}
              helperText={confirmError}
              margin="normal"
              required
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained">
                Reset password
              </Button>
              <Button component={Link} to="/login">
                Back to Log in
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
