import { Box, Container, Typography } from '@mui/material';
import { MainLayout } from '@/components/layout';

export function ExplorePage() {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom>
          Explore Restaurants
        </Typography>
        <Typography color="text.secondary">
          Restaurant listings and search will be available here soon.
        </Typography>
      </Container>
    </MainLayout>
  );
}
