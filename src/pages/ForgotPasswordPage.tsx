import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Email as EmailIcon, Restaurant as RestaurantIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validation';

export function ForgotPasswordPage() {
  const { forgotPassword, error, clearError } = useAuth();
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    clearError();
    setSubmitError(null);
    const result = await forgotPassword(data.email);
    if (result.success) {
      setSent(true);
      return;
    }
    setSubmitError(result.error?.message ?? 'Something went wrong');
  };

  if (sent) {
    return (
      <Box
        sx={{
          height: '100dvh',
          maxHeight: '-webkit-fill-available',
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
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(4px, 1.2dvh, 12px)',
            boxSizing: 'border-box',
          }}
        >
          <Alert severity="success" sx={{ mb: 0 }}>
            If an account exists for this email, you will receive a password reset link.
          </Alert>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 'clamp(8px, 2dvh, 14px)',
              minHeight: 'clamp(40px, 10dvh, 48px)',
              fontSize: 'clamp(0.875rem, 2.2dvh, 1rem)',
            }}
          >
            Back to Log in
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100dvh',
        maxHeight: '-webkit-fill-available',
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
        {/* Logo - same as LoginPage */}
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
          Forgot password?
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: 'clamp(0.8rem, 2dvh, 1rem)',
            flexShrink: 0,
          }}
        >
          Enter your email and we&apos;ll send you a link to reset your password.
        </Typography>

        {/* Error */}
        {(error || submitError) && (
          <Alert
            severity="error"
            onClose={() => {
              clearError();
              setSubmitError(null);
            }}
            sx={{ flexShrink: 0 }}
          >
            {submitError ?? error}
          </Alert>
        )}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1.2dvh, 14px)' }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Email address"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ input: { sx: { fontSize: 'clamp(14px, 2.5dvh, 16px)' } } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 'clamp(18px, 3dvh, 24px)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { minHeight: 'clamp(40px, 10dvh, 56px)' } }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 'clamp(8px, 2dvh, 14px)',
              minHeight: 'clamp(40px, 10dvh, 48px)',
              fontSize: 'clamp(0.875rem, 2.2dvh, 1rem)',
              flexShrink: 0,
            }}
          >
            Send reset link
          </Button>
        </Box>

        {/* Divider - same as LoginPage */}
        <Divider sx={{ flexShrink: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontSize: 'clamp(0.65rem, 1.8dvh, 0.75rem)',
            }}
          >
            Remember your password?
          </Typography>
        </Divider>

        {/* Back to Log in */}
        <Button
          component={Link}
          to="/login"
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
          Back to Log in
        </Button>
      </Box>
    </Box>
  );
}
