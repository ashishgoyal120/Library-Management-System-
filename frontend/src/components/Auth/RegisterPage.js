import { PersonAdd } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Link as MuiLink, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthApi, getErrorMessage, isValidEmail } from '../../services/api';
import { useAuth } from '../../AuthContext';
import { countryCodes, defaultCountryCode, digitsOnly } from '../../constants/countryCodes';
import { AuthPageFrame } from './AuthPageFrame';

export function RegisterPage({ themeMode, onToggleThemeMode }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    countryCode: defaultCountryCode,
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
    if (!isValidEmail(form.email)) {
      toast.error('Invalid email');
      return;
    }
    if (form.phone && form.phone.length < 7) {
      toast.error('Phone number must be at least 7 digits');
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
    <AuthPageFrame themeMode={themeMode} onToggleThemeMode={onToggleThemeMode} compact>
      <Card
        sx={{
          width: 420,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(14px)',
        }}
      >
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
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
                <TextField
                  select
                  label="Country Code"
                  value={form.countryCode}
                  onChange={(e) => setField('countryCode', e.target.value)}
                  sx={{ minWidth: { sm: 180 } }}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => setField('phone', digitsOnly(e.target.value))}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 15 }}
                  fullWidth
                />
              </Stack>
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
    </AuthPageFrame>
  );
}
