import { Box, Container, Typography } from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom>
          Profile
        </Typography>
        <Typography color="text.secondary">
          {user?.name ? `Signed in as ${user.name}.` : 'Loading…'} Profile settings will be available here soon.
        </Typography>
      </Container>
    </MainLayout>
  );
}
