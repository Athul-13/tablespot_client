import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

export function LandingPage() {
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
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="span" color="primary" fontWeight={600}>
          TableSpot
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/login" variant="outlined" color="primary">
            Log in
          </Button>
          <Button component={Link} to="/signup" variant="contained" color="primary">
            Sign up
          </Button>
        </Box>
      </Box>
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
          Discover restaurants near you
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 560, mx: 'auto' }}>
          Find and share your favourite spots. Add your own listings and explore what others recommend.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} to="/signup" variant="contained" color="primary" size="large">
            Sign up
          </Button>
          <Button component={Link} to="/login" variant="outlined" color="primary" size="large">
            Log in
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
