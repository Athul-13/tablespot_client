import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const NAVBAR_HEIGHT = { xs: 64, lg: 80 };

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: `${NAVBAR_HEIGHT.xs}px`, lg: `${NAVBAR_HEIGHT.lg}px` },
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
