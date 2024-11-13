import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
  Button,
  styled,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

// Custom styled components to achieve pixel art style
const PixelTypography = styled(Typography)({
  fontFamily: '"Pixelsplitter", monospace',
  textTransform: 'uppercase',
});

const PixelButton = styled(Button)({
  fontFamily: '"Pixelsplitter", monospace',
  textTransform: 'uppercase',
  padding: '16px 24px',
  borderRadius: 0,
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const PixelTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: 'black',
      borderWidth: 2,
    },
  },
  '& .MuiOutlinedInput-input': {
    fontFamily: '"Pixelsplitter", monospace',
    fontSize: '16px',
    padding: '16px',
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Pixelsplitter", monospace',
    fontSize: '14px',
  },
});

function ForgotPasswordComponent() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendPasswordResetEmail } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
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
    <Box sx={{ bgcolor: 'black', minHeight: '100vh', display: 'flex', flexDirection: 'column', py: 4 }}>
      <Container maxWidth="sm">
        <MuiLink
          href="#"
          onClick={() => navigate(-1)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'white',
            textDecoration: 'none',
            mb: 6,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <ArrowBackIcon />
          <PixelTypography>Go Back</PixelTypography>
        </MuiLink>

        <PixelTypography
          variant="h1"
          sx={{
            fontSize: '3rem',
            textAlign: 'center',
            color: 'white',
            mb: 6,
          }}
        >
          Forgot Password
        </PixelTypography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <PixelTypography component="label" sx={{ display: 'block', color: 'white', mb: 1 }}>
              Email:
            </PixelTypography>
            <PixelTextField
              fullWidth
              value={email}
              onChange={handleChange}
              type="email"
              required
              placeholder="Enter your email"
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 4 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <PixelButton
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#6b46c1',
                '&:hover': { bgcolor: '#553c9a' },
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </PixelButton>
            <PixelButton
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{
                bgcolor: '#d9f99d',
                color: 'black',
                '&:hover': { bgcolor: '#bef264' },
              }}
            >
              Back to Login
            </PixelButton>
          </Box>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <MuiLink
            href="#"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontFamily: '"Pixelsplitter", monospace',
              fontSize: '0.875rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Need help? Contact Support
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPasswordComponent;
