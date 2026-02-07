import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/toastContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, clearError } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});
    setIsLoading(true);

    const result = await signup({
      name,
      email,
      password,
      phone: phone.trim() || undefined,
    });
    if (result.success) {
      toast.success('Account created. Please sign in.');
      navigate('/login', { replace: true });
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
    toast.error(err?.message ?? 'Sign up failed');
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        height: '100dvh',
        maxHeight: '-webkit-fill-available',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Side - Image (alternate from login: image on left here) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          flex: 1,
          minWidth: 0,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, hsl(30, 15%, 8%) 0%, hsl(30, 20%, 15%) 100%)',
          }}
        />
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?&q=80"
          alt="Restaurant ambiance"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'overlay',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { lg: 4, xl: 6 },
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: '90%' }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"DM Serif Display", serif',
                fontSize: { lg: '2rem', xl: '2.5rem' },
                color: 'white',
                mb: { lg: 1.5, xl: 2 },
              }}
            >
              Join the TableSpot Community
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { lg: '1rem', xl: '1.1rem' },
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Create your account and start discovering restaurants near you.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Form: no scroll, scale to fit viewport */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          py: { xs: 'clamp(8px, 2.5vh, 24px)', sm: 2, md: 3 },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '420px',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'clamp(8px, 2dvh, 16px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                p: { xs: 1, sm: 1.25 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
                boxShadow: '0 0 40px hsla(24, 100%, 50%, 0.15)',
              }}
            >
              <RestaurantIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"DM Serif Display", serif',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              TableSpot
            </Typography>
          </Box>

          {/* Header */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' },
              lineHeight: 1.2,
              flexShrink: 0,
            }}
          >
            Create an account
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              flexShrink: 0,
            }}
          >
            Sign up to discover restaurants and manage your dining experience.
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1.2dvh, 12px)', }}>
            <TextField
              fullWidth
              label="Full name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name}
              slotProps={{
                input: {
                  sx: { fontSize: 'clamp(13px, 2.2dvh, 16px)' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'text.secondary', fontSize: 'clamp(16px, 2.8dvh, 24px)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-root': { minHeight: 'clamp(36px, 8dvh, 56px)' } }}
            />

            <TextField
              fullWidth
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
              slotProps={{
                input: {
                  sx: { fontSize: 'clamp(13px, 2.2dvh, 16px)' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 'clamp(16px, 2.8dvh, 24px)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-root': { minHeight: 'clamp(36px, 8dvh, 56px)' } }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              slotProps={{
                input: {
                  sx: {
                    fontSize: 'clamp(13px, 2.2dvh, 16px)',
                    minHeight: 'clamp(36px, 8dvh, 56px)',
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        sx={{ minWidth: 40, minHeight: 40, p: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Phone (optional)"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={Boolean(fieldErrors.phone)}
              helperText={fieldErrors.phone}
              slotProps={{
                input: {
                  sx: { fontSize: 'clamp(13px, 2.2dvh, 16px)' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: 'text.secondary', fontSize: 'clamp(16px, 2.8dvh, 24px)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-root': { minHeight: 'clamp(36px, 8dvh, 56px)' } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                py: 'clamp(6px, 1.5dvh, 14px)',
                minHeight: 'clamp(36px, 8dvh, 48px)',
                fontSize: 'clamp(0.8125rem, 2dvh, 1rem)',
                flexShrink: 0,
              }}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ flexShrink: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textTransform: 'uppercase',
                fontSize: 'clamp(0.6rem, 1.5dvh, 0.75rem)',
              }}
            >
              Already have an account?
            </Typography>
          </Divider>

          {/* Sign In Link */}
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            fullWidth
            size="large"
            sx={{
              py: 'clamp(6px, 1.5dvh, 14px)',
              minHeight: 'clamp(36px, 8dvh, 48px)',
              fontSize: 'clamp(0.8125rem, 2dvh, 1rem)',
              flexShrink: 0,
            }}
          >
            Sign in
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
