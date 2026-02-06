import { Box, Container, Typography } from '@mui/material';
import { MainLayout } from '@/components/layout';

export function AddRestaurantPage() {
  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom>
          Add a Listing
        </Typography>
        <Typography color="text.secondary">
          Add your restaurant listing form will be available here soon.
        </Typography>
      </Container>
    </MainLayout>
  );
}
