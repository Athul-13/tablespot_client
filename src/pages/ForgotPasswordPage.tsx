import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export function ForgotPasswordPage() {
  const { forgotPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitError(null);
    const result = await forgotPassword(email);
    if (result.success) {
      setSent(true);
      return;
    }
    setSubmitError(result.error?.message ?? 'Something went wrong');
  };

  if (sent) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              If an account exists for this email, you will receive a password reset link.
            </Alert>
            <Button component={Link} to="/login" variant="contained">
              Back to Log in
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
            Forgot password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </Typography>
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
              margin="normal"
              required
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained">
                Send reset link
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
