import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { Restaurant, Explore, RateReview } from '@mui/icons-material';
import { MainLayout } from '@/components/layout';

export function LandingPage() {
  const theme = useTheme();

  return (
    <MainLayout>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 14 },
          px: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '80%',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '60%',
            borderRadius: '50%',
            background: `linear-gradient(225deg, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.15,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Discover restaurants near you
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                mb: 4,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Find and share your favourite spots. Add your own listings and explore what others recommend.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 3 }}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                to="/restaurants"
                variant="outlined"
                color="primary"
                size="large"
              >
                Explore Restaurants
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Value props */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 6, fontSize: { xs: '1.75rem', md: '2rem' } }}
          >
            Why TableSpot?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Explore sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Explore
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse curated restaurant listings and find the perfect spot for any occasion.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Restaurant sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Add Listings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share your favourite places with the community and help others discover great food.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <RateReview sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Reviews &amp; Ratings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read honest reviews and ratings from real diners before you book.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2rem' } }}>
            Ready to find your next favourite spot?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Join TableSpot and start exploring — or add your first listing today.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4 }}
          >
            Sign up free
          </Button>
        </Container>
      </Box>
    </MainLayout>
  );
}
