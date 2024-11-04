import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

function LoginComponent() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, state, dispatch } = useAppContext(); // Ensure dispatch is destructured
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setServerError('');
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    } catch (error) {
      setServerError('Google login failed. Please try again.');
    }
  };

  return (

    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'grey.50',
      py: 4
    }}>
      <Card sx={{
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.100'
      }}>
        <form onSubmit={handleSubmit}>
          <CardHeader
            title={
              <Typography
                variant="h5"
                align="center"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' }
                }}
              >
                Welcome Back
              </Typography>
            }
            subheader={
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}
              >
                Sign in to continue to your account
              </Typography>
            }
            sx={{ pb: 0, pt: 2 }}
          />
          <CardContent sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            px: 3,
            py: 2
          }}>
            {state.error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 1 }}
                onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
              >
                {state.error}
              </Alert>
            )}

            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'grey.50',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'primary.main',
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                }
              }}
            />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'grey.50',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'primary.main',
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                }
              }}
            />

            <Link
              href="/forgot-password"
              underline="hover"
              color="primary"
              align="right"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                mt: -1
              }}
            >
              Forgot password?
            </Link>
          </CardContent>

          <CardActions sx={{
            flexDirection: 'column',
            alignItems: 'stretch',
            px: 3,
            pb: 3
          }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mb: 2,
                height: 42,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                }
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Divider sx={{
              width: '100%',
              mb: 2,
              '&::before, &::after': {
                borderColor: 'grey.200',
              },

            }}>
              Or Continue With
            </Divider>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                mb: 2.5,
                height: 48,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Continue with Google
            </Button>

            <Typography variant="body1" align="center">
              Don't have an account?{' '}
              <Link
                href="/register"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                Sign up
              </Link>
            </Typography>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}

export default LoginComponent;
