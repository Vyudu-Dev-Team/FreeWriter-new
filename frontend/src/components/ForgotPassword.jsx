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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

function ForgotPasswordComponent() {

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendPasswordResetEmail } = useAppContext(); // Assuming you have this in context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(email);
      setSuccessMessage('Password reset link sent to your email.');
    } catch (error) {
      setErrors({ email: 'Failed to send reset link. Please try again.' });
    } finally {
      setIsLoading(false);
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
                Forgot Password
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
                Enter your email to reset your password
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
            {successMessage && (
              <Alert
                severity="success"
                sx={{ borderRadius: 1 }}
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </Alert>
            )}

            {errors.email && (
              <Alert
                severity="error"
                sx={{ borderRadius: 1 }}
                onClose={() => setErrors({ email: '' })}
              >
                {errors.email}
              </Alert>
            )}

            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Divider sx={{
              width: '100%',
              mb: 2,
              '&::before, &::after': {
                borderColor: 'grey.200',
              },
            }} />

            <Typography variant="body1" align="center">
              Remembered your password?{' '}
              <Link
                href="/login"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                Sign In
              </Link>
            </Typography>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}

export default ForgotPasswordComponent;
