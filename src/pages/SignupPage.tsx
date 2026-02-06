import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitError(null);
    setFieldErrors({});
    const result = await signup({
      name,
      email,
      password,
      phone: phone.trim() || undefined,
    });
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
    setSubmitError(err?.message ?? 'Sign up failed');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign up
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
          {(error || submitError) && (
            <Alert severity="error" onClose={() => { clearError(); setSubmitError(null); }} sx={{ mb: 2 }}>
              {submitError ?? error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name}
              margin="normal"
              required
            />
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone (optional)"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={Boolean(fieldErrors.phone)}
              helperText={fieldErrors.phone}
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }}>
              Sign up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
