import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  PersonOutlined as PersonOutlinedIcon,
  Email as EmailIcon,
  Restaurant as RestaurantIcon,
  Visibility,
  VisibilityOff,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext.tsx';
import { useRestaurants } from '@/contexts/RestaurantContext';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import profileHeroImage from '@/assets/profile-hero.jpg';

const CARD_SHADOW = '0 8px 24px -8px hsla(30, 10%, 12%, 0.12)';
const HERO_GRADIENT =
  'linear-gradient(to right, rgba(30, 25, 20, 0.95), rgba(30, 25, 20, 0.7), rgba(30, 25, 20, 0.3))';
const GRADIENT_PRIMARY =
  'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)';
const ICON_GLOW = '0 0 40px hsla(24, 100%, 50%, 0.15)';

type TabValue = 'account' | 'restaurants';

export function ProfilePage() {
  const { user, changePassword } = useAuth();
  const { toast } = useToast();
  const { restaurants, isLoading, fetchRestaurants } = useRestaurants();
  const [tab, setTab] = useState<TabValue>('account');

  const myRestaurants = user
    ? restaurants.filter((r) => r.createdByUserId === user.id)
    : [];

  useEffect(() => {
    if (tab === 'restaurants') fetchRestaurants();
  }, [tab, fetchRestaurants]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setIsChangingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);
    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } else {
      setPasswordError(result.error?.message ?? 'Failed to change password');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: '35vh', sm: '40vh', md: '45vh' },
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0 }}>
            <Box
              component="img"
              src={profileHeroImage}
              alt="Profile"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: HERO_GRADIENT }} />
          </Box>
          <Container sx={{ position: 'relative', zIndex: 10, pt: { xs: 9, lg: 11 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: '650px' }}>
              <Chip
                icon={<PersonOutlinedIcon sx={{ color: 'primary.main', fontSize: 16 }} />}
                label="Your account"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                  px: 1,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem', lg: '3.25rem' },
                  color: 'white',
                  lineHeight: 1.1,
                }}
              >
                Profile
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  mt: 1,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                Manage your account and restaurants
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Single card: pill tabs + content */}
        <Container
          maxWidth="md"
          sx={{
            position: 'relative',
            mt: { xs: -3, sm: -4, md: -5 },
            zIndex: 20,
            pb: { xs: 6, md: 10 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              boxShadow: CARD_SHADOW,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 40px -12px hsla(30, 10%, 12%, 0.18)',
              },
            }}
          >
            {/* Pill tab strip - theme aligned */}
            <Box
              sx={{
                px: { xs: 1.5, sm: 2 },
                pt: { xs: 1.5, sm: 2 },
                pb: 0,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ToggleButtonGroup
                value={tab}
                exclusive
                onChange={(_, v) => v != null && setTab(v)}
                fullWidth
                sx={{
                  flexDirection: { xs: 'column', sm: 'row' },
                  '& .MuiToggleButtonGroup-grouped': {
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                  '& .Mui-selected': {
                    background: GRADIENT_PRIMARY,
                    color: 'white',
                    borderColor: 'transparent',
                    boxShadow: ICON_GLOW,
                    '&:hover': {
                      background: 'linear-gradient(135deg, hsl(24, 100%, 45%) 0%, hsl(35, 100%, 50%) 100%)',
                      color: 'white',
                    },
                  },
                }}
              >
                <ToggleButton value="account">
                  <PersonIcon sx={{ mr: { xs: 0.75, sm: 1 }, fontSize: { xs: 18, sm: 20 } }} />
                  Account
                </ToggleButton>
                <ToggleButton value="restaurants">
                  <RestaurantIcon sx={{ mr: { xs: 0.75, sm: 1 }, fontSize: { xs: 18, sm: 20 } }} />
                  Restaurants
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Content area */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {tab === 'account' && (
                <Stack spacing={4}>
                  {/* Section: Account details - Landing-style label + icon blocks */}
                  <Box>
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        mb: 1,
                      }}
                    >
                      Your details
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: 2 }}>
                      Account details
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.5, sm: 2 },
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: '12px',
                          bgcolor: 'secondary.light',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 40, sm: 44 },
                            height: { xs: 40, sm: 44 },
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: GRADIENT_PRIMARY,
                            boxShadow: ICON_GLOW,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PersonIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 22 } }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Name
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {user?.name ?? '—'}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.5, sm: 2 },
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: '12px',
                          bgcolor: 'secondary.light',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 40, sm: 44 },
                            height: { xs: 40, sm: 44 },
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: GRADIENT_PRIMARY,
                            boxShadow: ICON_GLOW,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EmailIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 22 } }} />
                        </Box>
                        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                          <Typography variant="caption" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1" fontWeight={600} noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email ?? '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Section: Change password - distinct block */}
                  <Box
                    sx={{
                      pt: { xs: 2, sm: 3 },
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        mb: 1,
                      }}
                    >
                      Security
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: 2 }}>
                      Change password
                    </Typography>
                    <Stack spacing={2} sx={{ maxWidth: 400, width: '100%' }}>
                      <TextField
                        label="Current password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        size="small"
                        fullWidth
                        autoComplete="current-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowCurrentPassword((s) => !s)}
                                edge="end"
                                aria-label="toggle current password visibility"
                              >
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="New password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        size="small"
                        fullWidth
                        autoComplete="new-password"
                        helperText="At least 6 characters"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowNewPassword((s) => !s)}
                                edge="end"
                                aria-label="toggle new password visibility"
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        size="small"
                        fullWidth
                        autoComplete="new-password"
                        error={!!passwordError}
                        helperText={passwordError}
                      />
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={
                          isChangingPassword ||
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword
                        }
                      >
                        {isChangingPassword ? 'Changing…' : 'Change password'}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              )}

              {tab === 'restaurants' && (
                <Box sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                      <CircularProgress />
                    </Box>
                  ) : myRestaurants.length === 0 ? (
                    <Box
                      sx={{
                        py: { xs: 4, sm: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 64, sm: 80 },
                          height: { xs: 64, sm: 80 },
                          borderRadius: '20px',
                          background: GRADIENT_PRIMARY,
                          boxShadow: ICON_GLOW,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: { xs: 2, sm: 3 },
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'scale(1.05)' },
                        }}
                      >
                        <RestaurantIcon sx={{ color: 'white', fontSize: { xs: 32, sm: 40 } }} />
                      </Box>
                      <Typography
                        variant="h2"
                        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: 1, color: 'text.primary' }}
                      >
                        No restaurants yet
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: { xs: 2, sm: 3 }, maxWidth: 320, fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
                        Your restaurant list will appear here. Add your first spot or explore
                        what others have shared.
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: 360 }}>
                        <Button
                          component={Link}
                          to="/add-restaurant"
                          variant="contained"
                          startIcon={<AddIcon />}
                          fullWidth={false}
                          sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                          Add restaurant
                        </Button>
                        <Button
                          component={Link}
                          to="/restaurants"
                          variant="outlined"
                          endIcon={<ChevronRightIcon />}
                          fullWidth={false}
                          sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                          Explore restaurants
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ sm: 'center' }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <Typography variant="h2" sx={{ fontSize: '1.25rem' }}>
                          Your restaurants
                        </Typography>
                        <Button
                          component={Link}
                          to="/add-restaurant"
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                        >
                          Add restaurant
                        </Button>
                      </Stack>
                      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                        {myRestaurants.map((restaurant) => (
                          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={restaurant.id}>
                            <Box sx={{ position: 'relative' }}>
                              <RestaurantCard restaurant={restaurant} />
                              <Button
                                component={Link}
                                to={`/restaurants/${restaurant.id}/edit`}
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                sx={{
                                  mt: 1.5,
                                  width: '100%',
                                }}
                              >
                                Edit
                              </Button>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </MainLayout>
  );
}
