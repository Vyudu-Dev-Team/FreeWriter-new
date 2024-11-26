import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FreewriterCards from './CreateCard';
import StoryStarter from './StoryStarter';


const theme = createTheme({
  typography: {
    fontFamily: 'PixelSplitter, monospace',
  },
});

const TitleScreen = () => {
  const navigate = useNavigate()
  // return (
  //   <ThemeProvider theme={theme}>
  //   <Box
  //     sx={{
  //       background: "url('assets/images/starter-background.svg')",
  //       backgroundSize: '100% auto',
  //       height: '100vh',
  //       width: '100%',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //     }}
  //   >
  //     <Typography
  //       variant="h1"
  //       mt={15}
  //       sx={{
  //         color: '#D8F651',
  //         fontSize: { xs: '2rem', sm: '4rem', md: '5rem' },
  //         textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
  //       }}
  //     >
  //       FREE<span style={{ color: '#fff' }}>WRITER</span>
  //     </Typography>
  //     <Typography color={'#fff'} fontSize={'1.4rem'} mt={2} variant='p'>Focused Writing Journey for the Busy Mind</Typography>
  //     <Button
  //       onClick={() => navigate('/login')
  //         //setStartScreen(false)
  //         }
  //       variant="text"
  //       sx={{
  //         color: '#D8F651',
  //         mt: 15,
  //         fontSize: { xs: '1rem', sm: '1.2rem', },
  //         '&:hover': {
  //           backgroundColor: 'rgba(255,255,255,0.1)',
  //         },
  //       }}
  //     >
  //       PRESS START
  //     </Button>
  //   </Box>
  // </ThemeProvider>
  // );

  return (
    <StoryStarter />
  )
};

export default TitleScreen;


