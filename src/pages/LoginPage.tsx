import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Visibility,
  VisibilityOff,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/toastContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clearError } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const successMessage = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/', { replace: true });
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
    toast.error(err?.message ?? 'Invalid credentials');
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
      {/* Left Side - Form: no scroll, scale to fit viewport */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          p: { xs: 'clamp(8px, 2vw, 24px)', sm: 2, md: 3, lg: 4 },
          py: 'clamp(6px, 1.5dvh, 24px)',
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
            gap: 'clamp(4px, 1.2dvh, 12px)',
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
                p: 'clamp(6px, 1.2dvh, 10px)',
                borderRadius: 2,
                background: 'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
                boxShadow: '0 0 40px hsla(24, 100%, 50%, 0.15)',
              }}
            >
              <RestaurantIcon sx={{ color: 'white', fontSize: 'clamp(18px, 4dvh, 24px)' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"DM Serif Display", serif',
                fontSize: 'clamp(0.95rem, 2.5dvh, 1.25rem)',
              }}
            >
              TableSpot
            </Typography>
          </Box>

          {/* Header */}
          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(1.15rem, 4dvh, 2.25rem)',
              lineHeight: 1.2,
              flexShrink: 0,
            }}
          >
            Welcome back
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: 'clamp(0.8rem, 2dvh, 1rem)',
              flexShrink: 0,
            }}
          >
            Sign in to manage your restaurants and discover new ones.
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1.2dvh, 14px)' }}>
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
                  sx: { fontSize: 'clamp(14px, 2.5dvh, 16px)' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 'clamp(18px, 3dvh, 24px)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-root': { minHeight: 'clamp(40px, 10dvh, 56px)' } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: -0.5 }}>
              <Button
                component={Link}
                to="/forgot-password"
                sx={{
                  fontSize: 'clamp(0.75rem, 2dvh, 0.875rem)',
                  fontWeight: 500,
                  color: 'primary.main',
                  p: 0,
                  minWidth: 0,
                  minHeight: 36,
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Button>
            </Box>

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
                    fontSize: 'clamp(14px, 2.5dvh, 16px)',
                    minHeight: 'clamp(40px, 10dvh, 56px)',
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


            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                py: 'clamp(8px, 2dvh, 14px)',
                minHeight: 'clamp(40px, 10dvh, 48px)',
                fontSize: 'clamp(0.875rem, 2.2dvh, 1rem)',
                flexShrink: 0,
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ flexShrink: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textTransform: 'uppercase',
                fontSize: 'clamp(0.65rem, 1.8dvh, 0.75rem)',
              }}
            >
              New to TableSpot?
            </Typography>
          </Divider>

          {/* Sign Up Link */}
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            fullWidth
            size="large"
            sx={{
              py: 'clamp(8px, 2dvh, 14px)',
              minHeight: 'clamp(40px, 10dvh, 48px)',
              fontSize: 'clamp(0.875rem, 2.2dvh, 1rem)',
              flexShrink: 0,
            }}
          >
            Create an account
          </Button>
        </Box>
      </Box>

      {/* Right Side - Image */}
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
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?"
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
              Discover Amazing Restaurants
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { lg: '1rem', xl: '1.1rem' },
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Join thousands of food lovers finding their next favorite dining experience.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
