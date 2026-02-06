import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(24, 100%, 50%)',
      light: 'hsl(35, 100%, 55%)',
      dark: 'hsl(24, 100%, 40%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(35, 30%, 94%)',
      light: 'hsl(40, 20%, 98%)',
      dark: 'hsl(30, 20%, 85%)',
      contrastText: 'hsl(30, 10%, 20%)',
    },
    error: {
      main: 'hsl(0, 72%, 51%)',
      contrastText: '#ffffff',
    },
    success: {
      main: 'hsl(160, 60%, 35%)',
      contrastText: '#ffffff',
    },
    warning: {
      main: 'hsl(42, 100%, 50%)',
      contrastText: 'hsl(30, 10%, 12%)',
    },
    background: {
      default: 'hsl(40, 20%, 98%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(30, 10%, 12%)',
      secondary: 'hsl(30, 8%, 45%)',
    },
    divider: 'hsl(35, 20%, 88%)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontFamily: '"DM Serif Display", serif',
      letterSpacing: '-0.02em',
      fontWeight: 400,
    },
    h2: {
      fontFamily: '"DM Serif Display", serif',
      letterSpacing: '-0.02em',
      fontWeight: 400,
    },
    h3: {
      fontFamily: '"DM Serif Display", serif',
      letterSpacing: '-0.02em',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"DM Serif Display", serif',
      letterSpacing: '-0.02em',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"DM Serif Display", serif',
      letterSpacing: '-0.02em',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"DM Serif Display", serif',
      letterSpacing: '-0.02em',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
          boxShadow: '0 0 40px hsla(24, 100%, 50%, 0.15)',
          '&:hover': {
            background: 'linear-gradient(135deg, hsl(24, 100%, 45%) 0%, hsl(35, 100%, 50%) 100%)',
            boxShadow: '0 0 50px hsla(24, 100%, 50%, 0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 24px -8px hsla(30, 10%, 12%, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default muiTheme;
