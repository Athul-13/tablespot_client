import { Box, Container, Typography } from '@mui/material';
import { MainLayout } from '@/components/layout';

export function AddRestaurantPage() {
  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
          Add a Listing
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.9375rem', md: '1rem' } }}>
          Add your restaurant listing form will be available here soon.
        </Typography>
      </Container>
    </MainLayout>
  );
}
