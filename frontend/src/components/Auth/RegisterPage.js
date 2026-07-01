import { PersonAdd } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Link as MuiLink, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthApi, getErrorMessage } from '../../services/api';
import { useAuth } from '../../AuthContext';
import { ThemeModeToggle } from '../Common/ThemeModeToggle';

export function RegisterPage({ themeMode, onToggleThemeMode }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password || !form.name.trim() || !form.email.trim()) {
      toast.error('Username, password, name and email are required');
      return;
    }
    try {
      setLoading(true);
      const res = await AuthApi.register(form);
      login(res.data);
      toast.success('Registration successful');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
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
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a basic account to use the library system.
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack gap={2}>
              <TextField
                label="Username"
                value={form.username}
                onChange={(e) => setField('username', e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                fullWidth
              />
              <TextField label="Full Name" value={form.name} onChange={(e) => setField('name', e.target.value)} fullWidth />
              <TextField label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} fullWidth />
              <TextField label="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} fullWidth />
              <TextField
                label="Address"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAdd />}
                disabled={loading}
                sx={{ mt: 1 }}
                fullWidth
              >
                Register
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Already registered?{' '}
            <MuiLink
              component={RouterLink}
              to="/login"
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? '#93c5fd' : 'primary.main'),
                fontWeight: 700,
              }}
            >
              Login here
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
