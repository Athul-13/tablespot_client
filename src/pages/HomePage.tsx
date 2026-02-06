import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          py: 2,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" component="span" color="primary" fontWeight={600}>
          TableSpot
        </Typography>
        <Button component={Link} to="/home" variant="outlined" size="small" sx={{ mr: 1 }}>
          Home
        </Button>
        <Button onClick={handleLogout} variant="outlined" color="primary">
          Log out
        </Button>
      </Box>
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name ?? 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You&apos;re logged in. Restaurant listing and more features coming soon.
        </Typography>
      </Container>
    </Box>
  );
}
