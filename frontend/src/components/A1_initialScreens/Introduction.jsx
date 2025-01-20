import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Introduction() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/assets/images/backgrounds/backgroundInitial.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        gap: 2
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#D8F651',
          fontFamily: 'PixelSplitter, monospace',
          fontSize: '6rem',
          marginBottom: '0'
        }}
      >
        FREE<span style={{ color: '#fff' }}>WRITER</span>
      </Typography>

      <Typography
        sx={{
          color: '#fff',
          fontFamily: 'Quicksand, monospace',
          fontSize: '1.2rem',
          textAlign: 'center',
          maxWidth: '80%',
          marginTop: '0',
          marginBottom: '30px'
        }}
      >
        Focused Writing Journey for the Busy Mind
      </Typography>

      <Button
        onClick={() => navigate('/login')}
        variant="contained"
        sx={{
          bgcolor: '#D8F651',
          color: '#490BF4',
          fontFamily: 'PixelSplitter, monospace',
          textTransform: 'none',
          fontSize: '1.2rem',
          padding: '10px 30px',
          '&:hover': {
            bgcolor: '#c1dd47',
          },
          fontWeight: 'bold'
        }}
      >
        Press Start
      </Button>
    </Box>
  );
}