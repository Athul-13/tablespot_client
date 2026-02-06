import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/contexts/AuthContext';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { ToastProvider } from '@/contexts/ToastContext';
import muiTheme from '@/theme/muiTheme';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <RestaurantProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </RestaurantProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
