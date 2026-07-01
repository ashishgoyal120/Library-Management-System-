import { createTheme } from '@mui/material/styles';

export function createAppTheme(mode = 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#2563eb', dark: '#1d4ed8' },
      secondary: { main: '#0f766e' },
      background: {
        default: isDark ? '#0f172a' : '#f5f7fb',
        paper: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#111827',
        secondary: isDark ? '#cbd5e1' : '#6b7280',
      },
      divider: isDark ? '#334155' : '#e5e7eb',
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
      h5: {
        letterSpacing: 0,
      },
      button: {
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: 0,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            boxShadow: isDark ? '0 14px 30px rgba(0, 0, 0, 0.24)' : '0 14px 30px rgba(15, 23, 42, 0.06)',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 8,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
          },
        },
      },
    },
  });
}
