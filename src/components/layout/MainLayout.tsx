import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const NAVBAR_HEIGHT = { xs: 64, lg: 80 };

const HERO_PATHS = ['/', '/restaurants'];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHeroPage = HERO_PATHS.includes(location.pathname);

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
          pt: isHeroPage ? 0 : { xs: `${NAVBAR_HEIGHT.xs}px`, lg: `${NAVBAR_HEIGHT.lg}px` },
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
