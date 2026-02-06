import { Container, Typography } from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Welcome, {user?.name ?? 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You&apos;re logged in. Restaurant listing and more features coming soon.
        </Typography>
      </Container>
    </MainLayout>
  );
}
