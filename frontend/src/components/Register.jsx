import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  Typography,
  Divider,
  Link,
  Box,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';


function RegisterComponent() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { register, state, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.username.trim()) {
      tempErrors.username = 'Full Name is required';
    } else if (formData.username.trim().length < 2) {
      tempErrors.username = 'Username must be at least 2 characters long';
    }

    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      tempErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      tempErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsLoading(true);
        const success = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (success) {
          navigate('/dashboard');
        }
      } finally {
        setIsLoading(false);
      }
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
                Create an account
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
                Enter your information to register
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
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              required
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
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
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Divider sx={{
              width: '100%',
              mb: 2, 
              '&::before, &::after': {
                borderColor: 'grey.200',
              },
              '& .MuiDivider-wrapper': {
                color: 'text.secondary',
                fontSize: '0.875rem'
              }
            }}>
              Or Continue With
            </Divider>
            <Button
              onClick={handleGoogleLogin}
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                mb: 2, 
                height: 42, 
                borderRadius: 1.5, 
                textTransform: 'none',
                fontSize: '0.9375rem', 
                fontWeight: 500,
                borderColor: 'grey.300',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'grey.50',
                  borderColor: 'grey.400',
                }
              }}
            >
              Continue with Google
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link
                href="/login"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                Sign in
              </Link>
            </Typography>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}

export default RegisterComponent;
