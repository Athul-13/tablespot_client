import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validation';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, error, clearError } = useAuth();
  const token = searchParams.get('token') ?? '';
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    clearError();
    setSubmitError(null);
    const result = await resetPassword(token, data.newPassword);
    if (result.success) {
      navigate('/login', { replace: true, state: { message: 'Password reset successfully. You can log in now.' } });
      return;
    }
    setSubmitError(result.error?.message ?? 'Failed to reset password');
  };

  if (!token) {
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
                background:
                  'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
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
          <Alert severity="warning">
            Invalid or missing reset link. Please request a new password reset from the login
            page.
          </Alert>
          <Button
            component={Link}
            to="/forgot-password"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 'clamp(8px, 2dvh, 14px)',
              minHeight: 'clamp(40px, 10dvh, 48px)',
              fontSize: 'clamp(0.875rem, 2.2dvh, 1rem)',
            }}
          >
            Request reset link
          </Button>
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
        {/* Logo - same as LoginPage / ForgotPasswordPage */}
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
              background:
                'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
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
          Reset password
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: 'clamp(0.8rem, 2dvh, 1rem)',
            flexShrink: 0,
          }}
        >
          Enter your new password below.
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
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="New password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ input: { sx: { fontSize: 'clamp(14px, 2.5dvh, 16px)' } } }}
                sx={{ '& .MuiInputBase-root': { minHeight: 'clamp(40px, 10dvh, 56px)' } }}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ input: { sx: { fontSize: 'clamp(14px, 2.5dvh, 16px)' } } }}
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
            Reset password
          </Button>
        </Box>

        {/* Divider - same as LoginPage / ForgotPasswordPage */}
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
