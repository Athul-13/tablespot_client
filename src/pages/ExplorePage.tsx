import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { useRestaurants } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import exploreHeroImage from '@/assets/explore-hero.jpg';

export function ExplorePage() {
  const { user } = useAuth();
  const { restaurants, isLoading, error, fetchRestaurants } = useRestaurants();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

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
              src={exploreHeroImage}
              alt="Explore restaurants"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(30, 25, 20, 0.95), rgba(30, 25, 20, 0.7), rgba(30, 25, 20, 0.3))',
              }}
            />
          </Box>

          <Container
            sx={{
              position: 'relative',
              zIndex: 10,
              pt: { xs: 9, lg: 11 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: '1.75rem',
                  sm: '2rem',
                  md: '2.75rem',
                  lg: '3.25rem',
                },
                color: 'white',
                fontWeight: 700,
              }}
            >
              Explore Restaurants
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                mt: 1,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Discover your next favorite spot
            </Typography>
          </Container>
        </Box>

        <Container
          maxWidth="lg"
          sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}
        >
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button variant="outlined" onClick={() => fetchRestaurants()}>
                Try again
              </Button>
            </Box>
          )}

          {!isLoading && !error && restaurants.length === 0 && (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography color="text.secondary">
                No restaurants yet. Be the first to add one.
              </Typography>
              {user && (
                <Button
                  component={Link}
                  to="/add-restaurant"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add restaurant
                </Button>
              )}
            </Box>
          )}

          {!isLoading && !error && restaurants.length > 0 && (
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {restaurants.map((restaurant) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}
