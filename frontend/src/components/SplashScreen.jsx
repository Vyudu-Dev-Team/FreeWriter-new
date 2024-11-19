import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: 'PixelSplitter, monospace',
  },
});

const TitleScreen = () => {
  const [startScreen, setStartScreen] = useState(true);
  return (
    startScreen ? <StartScreen setStartScreen={setStartScreen} /> : <StartScreen2 />
  );
};

export default TitleScreen;

function StartScreen2() {
  const navigate = useNavigate()
  
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#490BF4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: '#D8F651',
          fontSize: { xs: '2rem', sm: '4rem', md: '6rem' },
          mb: 10,
          textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
        }}
      >
        FREE<span style={{ color: '#fff' }}>WRITER</span>
      </Typography>
      <Box
        sx={{
          width: { xs: '60px', sm: '80px', md: '100px' },
          height: { xs: '60px', sm: '80px', md: '100px' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px solid #D8F651',
          }}
        />
        <IconButton
          onClick={() => navigate('/home')}
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'rgba(216, 246, 81, 0.1)',
            },
          }}
        >
          <PlayArrowIcon
            sx={{
              color: '#D8F651',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            }}
          />
        </IconButton>
      </Box>
      <Typography
        sx={{
          color: '#D8F651',
          fontFamily: 'PixelSplitter, monospace',
          fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
          marginTop: '1rem',
        }}
      >
        PLAY
      </Typography>
    </Box>
  );
}

function StartScreen( {setStartScreen} ) {
  const navigate = useNavigate()
  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        bgcolor: '#490BF4',
        height: '100vh',
        width: '100%',
        display: 'flex',
        gap: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: '#D8F651',
          fontSize: { xs: '2rem', sm: '4rem', md: '6rem' },
          mb: 10,
          textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
        }}
      >
        FREE<span style={{ color: '#fff' }}>WRITER</span>
      </Typography>
      <Button
        onClick={() => navigate('/home')
          //setStartScreen(false)
          }
        variant="text"
        sx={{
          color: 'white',
          fontSize: { xs: '1rem', sm: '1.5rem', },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        PRESS START
      </Button>
    </Box>
  </ThemeProvider>
  );
} 
