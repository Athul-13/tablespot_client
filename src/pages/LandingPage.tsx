import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurants } from '@/contexts/RestaurantContext';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { MainLayout } from '@/components/layout';
import heroImage from '@/assets/hero-restaurant.jpg';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
  Place as PlaceIcon,
  Star as StarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

export function LandingPage() {
  const { user } = useAuth();
  const { restaurants, isLoading, fetchRestaurants } = useRestaurants();
  const featuredRestaurants = restaurants.slice(0, 3);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const stats = [
    { icon: PlaceIcon, value: '500+', label: 'Restaurants' },
    { icon: PeopleIcon, value: '50K+', label: 'Happy Diners' },
    { icon: StarIcon, value: '4.8', label: 'Avg Rating' },
  ];

  const features = [
    {
      icon: SearchIcon,
      title: 'Smart Discovery',
      description:
        'Find restaurants by cuisine, location, rating, or mood. Our intelligent search helps you discover your next favorite spot.',
    },
    {
      icon: StarIcon,
      title: 'Trusted Reviews',
      description:
        'Read authentic reviews from real diners. Make informed decisions based on genuine experiences.',
    },
    {
      icon: PlaceIcon,
      title: 'Easy Management',
      description:
        'Restaurant owners can easily add, update, and showcase their establishments to thousands of food lovers.',
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section - full-bleed from top so image shows behind transparent navbar */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: '70vh', sm: '80vh', md: '90vh' },
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Background Image */}
          <Box sx={{ position: 'absolute', inset: 0 }}>
            <Box
              component="img"
              src={heroImage}
              alt="Fine dining"
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

          {/* Content - padded below navbar so text is not hidden */}
          <Container sx={{ position: 'relative', zIndex: 10, pt: { xs: 9, lg: 11 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: '650px' }}>
              <Chip
                icon={<TrendingUpIcon sx={{ color: 'primary.main', fontSize: 16 }} />}
                label="#1 Restaurant Discovery Platform"
                sx={{
                  mb: 4,
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
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  color: 'white',
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Find Your Next
                <Box component="span" sx={{ display: 'block', color: 'primary.main', mt: 1 }}>
                  Culinary Adventure
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 5,
                  maxWidth: '500px',
                }}
              >
                Discover exceptional restaurants, read trusted reviews, and book your perfect dining
                experience—all in one place.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mb: 8,
                }}
              >
                <Button
                  component={Link}
                  to="/restaurants"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{ py: 1.75, px: 4 }}
                >
                  Explore Restaurants
                </Button>
                {!user && (
                  <Button
                    component={Link}
                    to="/signup"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.75,
                      px: 4,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Create Free Account
                  </Button>
                )}
              </Box>

              {/* Stats */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3, md: 4 } }}>
                {stats.map((stat, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stat.icon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>

          {/* Scroll Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              '@keyframes float': {
                '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
                '50%': { transform: 'translateX(-50%) translateY(-10px)' },
              },
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: 3,
              }}
            >
              Scroll
            </Typography>
            <Box
              sx={{
                width: 20,
                height: 32,
                borderRadius: 10,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                justifyContent: 'center',
                pt: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(6px)' },
                  },
                  animation: 'bounce 1.5s infinite',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            py: { xs: 6, sm: 8, md: 12 },
            bgcolor: 'background.default',
          }}
        >
          <Container sx={{ px: { xs: 2, sm: 3 } }}>
            <Box sx={{ textAlign: 'center', maxWidth: '650px', mx: 'auto', mb: { xs: 4, md: 8 } }}>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }, mb: 2 }}
              >
                Why Choose TableSpot?
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                Everything you need to discover, manage, and enjoy great dining experiences.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, sm: 3, md: 4 },
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 16px 48px -12px hsla(30, 10%, 12%, 0.16)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background:
                          'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
                        boxShadow: '0 0 40px hsla(24, 100%, 50%, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        transition: 'transform 0.3s ease',
                        '.MuiPaper-root:hover &': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <feature.icon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Featured Restaurants */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 12 } }}>
          <Container sx={{ px: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { md: 'flex-end' },
                justifyContent: 'space-between',
                gap: 2,
                mb: { xs: 4, md: 6 },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Handpicked for you
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, mt: 1 }}
                >
                  Featured Restaurants
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/restaurants"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:hover .MuiSvgIcon-root': { transform: 'translateX(4px)' },
                  '& .MuiSvgIcon-root': { transition: 'transform 0.2s ease' },
                }}
              >
                View All Restaurants
              </Button>
            </Box>

            {isLoading && restaurants.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : featuredRestaurants.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4 }}>
                No featured restaurants yet. Explore all listings or add your own.
              </Typography>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {featuredRestaurants.map((restaurant, index) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={restaurant.id}>
                    <Box sx={{ animationDelay: `${index * 0.1}s` }}>
                      <RestaurantCard restaurant={restaurant} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
              opacity: 0.95,
            }}
          />
          <Container sx={{ position: 'relative', zIndex: 10, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: '750px', mx: 'auto', textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.75rem' },
                  color: 'white',
                  mb: { xs: 2, md: 3 },
                }}
              >
                Own a Restaurant?
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  mb: 5,
                  maxWidth: '550px',
                  mx: 'auto',
                }}
              >
                Join thousands of restaurant owners who trust TableSpot to connect with hungry diners.
                List your restaurant for free.
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                endIcon={<ChevronRightIcon />}
                sx={{
                  py: 1.75,
                  px: 5,
                  backgroundColor: 'white',
                  color: 'text.primary',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                }}
              >
                Add Your Restaurant
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </MainLayout>
  );
}
