import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const successMessage = (location.state as { message?: string } | null)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitError(null);
    setFieldErrors({});
    const result = await login(email, password);
    if (result.success) {
      navigate('/home', { replace: true });
      return;
    }
    const err = result.error;
    if (err?.details) {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(err.details)) {
        if (Array.isArray(v) && v[0]) next[k] = v[0];
      }
      setFieldErrors(next);
    }
    setSubmitError(err?.message ?? 'Login failed');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Log in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {(error || submitError) && (
            <Alert severity="error" onClose={() => { clearError(); setSubmitError(null); }} sx={{ mb: 2 }}>
              {submitError ?? error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Link to="/forgot-password" style={{ fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </Box>
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2 }}>
              Log in
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
