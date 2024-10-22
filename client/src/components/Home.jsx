import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Welcome to freeWriter
      </Typography>
      <Typography variant="body1" paragraph>
        An innovative storytelling and writing assistance tool designed to help aspiring writers create and develop their stories.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" component={RouterLink} to="/register" size="large">
          Get Started
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="text" color="primary" component={RouterLink} to="/help">
          Learn More
        </Button>
      </Box>
    </Container>
  );
}

export default Home;