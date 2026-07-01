import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export function ThemeModeToggle({ themeMode, onToggleThemeMode, sx }) {
  const nextMode = themeMode === 'dark' ? 'light' : 'dark';

  return (
    <Tooltip title={`Switch to ${nextMode} mode`}>
      <IconButton
        aria-label={`Switch to ${nextMode} mode`}
        onClick={onToggleThemeMode}
        color="inherit"
        size="small"
        sx={{ flexShrink: 0, ...sx }}
      >
        {themeMode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
