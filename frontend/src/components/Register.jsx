import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, RadioGroup, FormControlLabel, Radio, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import axios from 'axios';

function Register() {
  // ... (previous state declarations)

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.username = username ? '' : 'Username is required';
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Invalid email address';
    tempErrors.password = password.length >= 6 ? '' : 'Password must be at least 6 characters';
    tempErrors.password2 = password2 ? '' : 'Please confirm your password';
    if (password !== password2) {
      tempErrors.password2 = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === '');
  };

  // ... (rest of the component)
}

export default Register;