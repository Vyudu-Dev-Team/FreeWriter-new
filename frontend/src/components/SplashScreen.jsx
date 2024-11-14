import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'PixelSplitter, monospace',
  },
});

const TitleScreen = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: '#490BF4',
          height: '100vh',
          width: '100%',
          display: 'flex',
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
};

export default TitleScreen;