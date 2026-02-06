import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e40af' },
    secondary: { main: '#0f766e' },
    background: { default: '#f6f7fb' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

