import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

function Navbar() {
  const { state, dispatch } = useAppContext();
  const isAuthenticated = !!state.user;

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    // Add any additional logout logic here
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar src="/assets/images/logo.svg" alt="freeWriter Logo" sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          freeWriter
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={RouterLink} to="/deck">Deck</Button>
              <Button color="inherit" component={RouterLink} to="/feedback">Feedback</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;