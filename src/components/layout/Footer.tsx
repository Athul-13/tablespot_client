import { Link } from 'react-router-dom';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Restaurant as LogoIcon } from '@mui/icons-material';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              TableSpot
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              component={Link}
              to="/"
              underline="hover"
              color="text.secondary"
              variant="body2"
            >
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              to="/restaurants"
              underline="hover"
              color="text.secondary"
              variant="body2"
            >
              Explore
            </MuiLink>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          © {currentYear} TableSpot. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
