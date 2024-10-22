import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, RadioGroup, FormControlLabel, Radio, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    writingMode: 'Plotter'
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const { username, email, password, password2, writingMode } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.username = username ? '' : 'Username is required';
    tempErrors.email = email ? '' : 'Email is required';
    tempErrors.password = password ? '' : 'Password is required';
    tempErrors.password2 = password2 ? '' : 'Please confirm your password';
    if (password !== password2) {
      tempErrors.password2 = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === '');
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      setError('');
      try {
        await register(username, email, password, writingMode);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={onChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={onChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={onChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password2"
          label="Confirm Password"
          type="password"
          id="password2"
          autoComplete="new-password"
          value={password2}
          onChange={onChange}
          error={!!errors.password2}
          helperText={errors.password2}
        />
        <Tooltip title="Plotter: You prefer to plan your story in detail before writing. Pantser: You prefer to discover your story as you write.">
          <RadioGroup
            aria-label="writing-mode"
            name="writingMode"
            value={writingMode}
            onChange={onChange}
          >
            <FormControlLabel value="Plotter" control={<Radio />} label="Plotter" />
            <FormControlLabel value="Pantser" control={<Radio />} label="Pantser" />
          </RadioGroup>
        </Tooltip>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;