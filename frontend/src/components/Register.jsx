import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Container,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ArrowBack } from '@mui/icons-material';
import styled from '@mui/styled-engine';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const StyledContainer = styled(Container)({
  minHeight: '100vh',
  width: '100vw',
  maxWidth: '100% !important',
  margin: 0,
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'black',
  color: 'white',
  position: 'relative'
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b8ff57',
    },
    secondary: {
      main: '#6c5ce7',
    },
  },
  typography: {
    fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          '& .MuiInputBase-root': {
            backgroundColor: 'white',
            fontFamily: 'Quicksand, "Courier New", Courier, monospace',
          },
          '& .MuiInputBase-input': {
            color: 'black',
            backgroundColor: 'white',
            fontFamily: 'Quicksand, "Courier New", Courier, monospace',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent',
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
        },
      },
    },
  },
});

const StyledForm = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
});

function RegisterComponent() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    storyMode: 'pantser'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const success = await register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        storyMode: formData.storyMode
      });

      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'auth/email-already-in-use') {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      } else if (error.code === 'auth/username-already-in-use') {
        setErrors(prev => ({
          ...prev,
          username: 'This username is already taken'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Registration failed. Please try again.'
        }));
      }
    } 
  };

  const handleClickShowPassword = () => setShowPassword(prev => !prev);

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Link
          href="#"
          color="inherit"
          sx={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <ArrowBack sx={{ mr: 1 }} />
          GO BACK
        </Link>

        <Box sx={{

          maxWidth: '60%',
          padding: '2rem 4rem',
          background: 'rgba(73, 11, 244, 1)',
          margin: 'auto',
          mt: '4rem',
          borderRadius: '1rem'
        }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ mb: 4, letterSpacing: 4, fontSize: '40px' }}
          >
            CREATE AN ACCOUNT
          </Typography>

          <StyledForm onSubmit={handleSubmit} noValidate autoComplete="off">
          {state.error && (
              <Alert severity="error"
              onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
               sx={{ mb: 3, color: 'red' }}>
                {state.error}
              </Alert>
            )}
            <Box>
              <Typography
                variant="caption"
                component="label"
                htmlFor="username"
                sx={{ display: 'block', textAlign: 'left', mb: 1, fontSize: '1rem' }}
              >
                USERNAME:
              </Typography>
              <TextField
                fullWidth
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                placeholder="USERNAME"
                disabled={state.loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(73, 11, 244, 0.8)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                  },
                }}
              />
            </Box>


            <Box>
              <Typography
                variant="caption"
                component="label"
                htmlFor="email"
                sx={{ display: 'block', textAlign: 'left', mb: 1, fontSize: '1rem' }}
              >
                EMAIL:
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="EMAIL"
                disabled={state.loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(73, 11, 244, 0.8)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                component="label"
                htmlFor="password"
                sx={{ display: 'block', textAlign: 'left', mb: 1, fontSize: '1rem' }}
              >
                PASSWORD:
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                placeholder={showPassword ? 'PASSWORD' : '********'}
                disabled={state.loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{ color: 'black' }}
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(73, 11, 244, 0.8)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                  },
                  '& input[type="password"]': {
                    fontFamily: 'Verdana',
                    WebkitTextSecurity: showPassword ? 'disc' : 'password',
                  },
                  '& input::placeholder': {
                    fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
                  }
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                component="label"
                htmlFor="storyMode"
                sx={{ display: 'block', textAlign: 'left', mb: 1, fontSize: '1rem' }}
              >
                STORY MODE:
              </Typography>
              <TextField
                select
                fullWidth
                id="storyMode"
                name="storyMode"
                value={formData.storyMode}
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(73, 11, 244, 0.8)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                  },
                  '& select option': {
                    backgroundColor: 'black',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
                    padding: '12px',
                  },
                  '& select': {
                    '&:focus': {
                      backgroundColor: 'white',
                    }
                  }
                }}
              >
                <option value="pantser" style={{ padding: '12px' }}>PANTSER</option>
                <option value="plotter" style={{ padding: '12px' }}>PLOTTER</option>
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 4, my: 4 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  dispatch({ type: 'SET_ERROR', payload: null });
                  navigate('/login');
                }}
                sx={{ 
                  flex: 2, 
                  color: 'white', 
                  borderRadius: '1px', 
                  p: 2, 
                  fontSize: '1rem', 
                  bgcolor: 'black', 
                  whiteSpace: 'nowrap',
                  opacity: 1,
                  '&:hover': {
                    bgcolor: 'black',
                    opacity: 0.8
                  }
                }}
              >
                HAVE AN ACCOUNT? <span style={{ color: 'rgba(216, 246, 81, 1)' }}> LOG IN</span>
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={state.loading}
                sx={{ flex: 1, color: 'black', borderRadius: '1px', p: 2, fontSize: '1rem', bgcolor: 'rgba(216, 246, 81, 1)' }}
              >
                {state.loading ? 'CREATING...' : 'CREATE'}
              </Button>
            </Box>
          </StyledForm>
        </Box>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default RegisterComponent;

