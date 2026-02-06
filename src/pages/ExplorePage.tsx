import { Box, Container, Typography } from '@mui/material';
import { MainLayout } from '@/components/layout';
import exploreHeroImage from '@/assets/explore-hero.jpg';

export function ExplorePage() {
  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            minHeight: '45vh',
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

          <Container sx={{ position: 'relative', zIndex: 10, pt: { xs: 9, lg: 11 } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem', lg: '3.25rem' },
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

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography color="text.secondary">
            Restaurant listings and search will be available here soon.
          </Typography>
        </Container>
      </Box>
    </MainLayout>
  );
}
