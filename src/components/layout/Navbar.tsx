import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Restaurant as ChefHat,
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as UserIcon,
  Logout as LogOutIcon,
  Add as PlusIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/restaurants', label: 'Explore' },
] as const;

export function Navbar() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const isAuthenticated = Boolean(user);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navLinkSx = (path: string) => ({
    color: isActive(path) ? 'primary.main' : 'text.primary',
    fontWeight: 500,
    opacity: isActive(path) ? 1 : 0.85,
    '&:hover': { color: 'primary.main', opacity: 1 },
  });

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        transition: 'background-color 0.3s, box-shadow 0.3s, border-color 0.3s',
        ...(scrolled
          ? {
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(12px)',
              boxShadow: theme.shadows[1],
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }
          : { bgcolor: 'transparent' }),
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: { xs: 64, lg: 80 },
          px: { xs: 2, sm: 3 },
          maxWidth: 1280,
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Button
          component={Link}
          to="/"
          disableRipple
          sx={{
            p: 0,
            minWidth: 0,
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  filter: 'blur(8px)',
                  opacity: 0.4,
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  p: 1.25,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                }}
              >
                <ChefHat sx={{ fontSize: 24, color: 'primary.contrastText' }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontFamily: theme.typography.h1.fontFamily,
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                  color: 'text.primary',
                }}
              >
                TableSpot
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                Restaurant Finder
              </Typography>
            </Box>
          </Box>
        </Button>

        {/* Desktop nav */}
        <Box sx={{ flex: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', gap: 4 }}>
          {navLinks.map(({ to, label }) => (
            <Button
              key={to}
              component={Link}
              to={to}
              sx={navLinkSx(to)}
            >
              {label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button
              component={Link}
              to="/add-restaurant"
              sx={navLinkSx('/add-restaurant')}
            >
              Add Listing
            </Button>
          )}
        </Box>

        {/* Desktop auth */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/profile"
                  startIcon={
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        opacity: 0.15,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <UserIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </Box>
                  }
                  sx={{ color: 'text.secondary', fontWeight: 500, '&:hover': { color: 'text.primary' } }}
                >
                  {user?.name}
                </Button>
                <IconButton
                  onClick={() => logout()}
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                  aria-label="Sign out"
                >
                  <LogOutIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  sx={{ px: 2.5 }}
                >
                  Get Started
                </Button>
              </>
            ))}
        </Box>

        {/* Mobile menu button */}
        <IconButton
          onClick={() => setMobileMenuOpen((o) => !o)}
          sx={{ display: { lg: 'none' }, color: 'text.primary', marginLeft: 'auto' }}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* Mobile menu */}
      {!isDesktop && mobileMenuOpen && (
        <Box
          sx={{
            px: 2,
            py: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.background.paper, 0.98),
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Button
              component={Link}
              to="/"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
              sx={{ justifyContent: 'flex-start', py: 1.5, color: 'text.primary' }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/restaurants"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
              sx={{ justifyContent: 'flex-start', py: 1.5, color: 'text.primary' }}
            >
              Explore Restaurants
            </Button>
            {isAuthenticated && (
              <Button
                component={Link}
                to="/add-restaurant"
                fullWidth
                startIcon={<PlusIcon />}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ justifyContent: 'flex-start', py: 1.5, color: 'text.primary' }}
              >
                Add Listing
              </Button>
            )}
            <Box sx={{ borderTop: 1, borderColor: 'divider', my: 1.5 }} />
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/profile"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ justifyContent: 'flex-start', py: 1.5, color: 'text.primary' }}
                >
                  Profile Settings
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  sx={{ justifyContent: 'flex-start', py: 1.5, color: 'error.main' }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </AppBar>
  );
}
