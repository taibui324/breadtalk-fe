import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  type SelectChangeEvent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth, type UserRole } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('hq'); // 'hq', 'central-kitchen', 'store'
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as UserRole);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error states
    setError('');

    // Validate form
    let valid = true;
    const errors = {
      username: '',
      password: '',
    };

    if (!username) {
      errors.username = 'Username is required';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }

    if (!valid) {
      setFormErrors(errors);
      return;
    }

    // Attempt to log in
    try {
      await login(username, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  // Demo user information display
  const getDemoUsers = () => {
    switch (role) {
      case 'hq':
        return { username: 'admin', password: 'password' };
      case 'central-kitchen':
        return { username: 'kitchen', password: 'password' };
      case 'store':
        return { username: 'store1', password: 'password' };
      default:
        return { username: 'admin', password: 'password' };
    }
  };

  const demoUser = getDemoUsers();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        backgroundImage: 'linear-gradient(135deg, #f9afaf30 0%, #fcd6d630 50%, #faf1f130 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
              }}
            >
              BREADTALK
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', letterSpacing: 1 }}
            >
              STOCK AND DELIVERY MANAGEMENT TOOL
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 3 }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!formErrors.username}
              helperText={formErrors.username}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Login As:
              </Typography>
              <Select
                value={role}
                onChange={handleRoleChange}
                displayEmpty
                sx={{ textAlign: 'left' }}
                disabled={loading}
              >
                <MenuItem value="hq">Headquarters</MenuItem>
                <MenuItem value="central-kitchen">Central Kitchen</MenuItem>
                <MenuItem value="store">Store</MenuItem>
              </Select>
              <FormHelperText>Select your role in the organization</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                Demo Credentials:
              </Typography>
              <Typography variant="caption" display="block">
                Username: <strong>{demoUser.username}</strong>
              </Typography>
              <Typography variant="caption" display="block">
                Password: <strong>{demoUser.password}</strong>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
