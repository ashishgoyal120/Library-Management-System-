import { Box, CircularProgress } from '@mui/material';

export function Loader({ minHeight = 200 }) {
  return (
    <Box
      sx={{
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

