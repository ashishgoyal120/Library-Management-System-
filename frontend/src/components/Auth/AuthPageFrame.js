import { Box } from '@mui/material';
import authBackground from '../../assets/library-auth-bg.svg';
import { ThemeModeToggle } from '../Common/ThemeModeToggle';

export function AuthPageFrame({ children, themeMode, onToggleThemeMode, compact = false }) {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        mx: { xs: -2, sm: -3, lg: -4 },
        my: { xs: -2.5, sm: -3 },
        px: { xs: 2, sm: 3 },
        py: { xs: 8, sm: compact ? 6 : 10 },
        display: 'flex',
        alignItems: compact ? 'flex-start' : 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: (theme) => {
          const overlay =
            theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, rgba(2, 6, 23, 0.72), rgba(15, 23, 42, 0.34), rgba(2, 6, 23, 0.78))'
              : 'linear-gradient(90deg, rgba(248, 250, 252, 0.8), rgba(239, 246, 255, 0.34), rgba(15, 23, 42, 0.2))';
          return `${overlay}, url(${authBackground})`;
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <ThemeModeToggle
        themeMode={themeMode}
        onToggleThemeMode={onToggleThemeMode}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
