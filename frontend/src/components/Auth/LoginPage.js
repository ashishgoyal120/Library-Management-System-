import { LockOpen } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Link as MuiLink, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthApi, getErrorMessage } from '../../services/api';
import { useAuth } from '../../AuthContext';
import { ThemeModeToggle } from '../Common/ThemeModeToggle';

export function LoginPage({ themeMode, onToggleThemeMode }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      toast.error('Username and password are required');
      return;
    }
    try {
      setLoading(true);
      const res = await AuthApi.login(form);
      login(res.data);
      toast.success('Logged in');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <ThemeModeToggle
        themeMode={themeMode}
        onToggleThemeMode={onToggleThemeMode}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      />
      <Card sx={{ width: 380 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Library Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Login using your registered username and password.
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack gap={2}>
              <TextField
                label="Username"
                value={form.username}
                onChange={(e) => setField('username', e.target.value)}
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<LockOpen />}
                disabled={loading}
                sx={{ mt: 1 }}
                fullWidth
              >
                Login
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Don&apos;t have an account?{' '}
            <MuiLink
              component={RouterLink}
              to="/register"
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? '#93c5fd' : 'primary.main'),
                fontWeight: 700,
              }}
            >
              Register here
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
