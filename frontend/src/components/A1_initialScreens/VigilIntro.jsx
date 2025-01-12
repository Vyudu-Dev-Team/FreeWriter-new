import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FreewriterTutorial({ handleSkipTutorial, setShowIntro }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#490BF4',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundSize: 'cover',
      }}
    >
      <Container
			ml={0}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'start',
          position: 'absolute',
          top: 20,
          gap: '40%',
          borderColor: '#FFF'
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            color: 'white',
            fontFamily: 'PixelSplitter, monospace',
            textTransform: 'none',
          }}
        >
          GO BACK
        </Button>
        <Typography
          variant="h4"
          sx={{
            color: '#D8F651',
            fontFamily: 'PixelSplitter, monospace',
            fontSize: '2rem',
          }}
        >
          FREE<span style={{ color: '#fff' }}>WRITER</span>
        </Typography>
      </Container>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          p: 4,
        }}
      >
        <Box
          component="img"
          src="/assets/images/vigil.svg"
          alt="Character"
          sx={{
            height: { xs: '150px', md: '400px' },
            width: 'auto',
            position: 'relative',
            zIndex: 10,
            left: 43
          }}
        />
        <Box
          sx={{
            bgcolor: '#D8F651',
            borderRadius: 2,
            p: 10,
            maxWidth: '50%',
            height: '60vh'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#490BF4',
              fontFamily: 'PixelSplitter, monospace',
              fontSize: '30px',
              mb: 2,
							textAlign: 'start',
            }}
          >
            HI, I'M VIRGIL
          </Typography>
          <Typography
            sx={{
              color: '#000',
              fontFamily: 'Quicksand, monospace',
              fontSize: '1.1rem',
              my: 5,
							textAlign: 'start',
							fontWeight: 'bold'
            }}
          >
            in order to defeat The Block you must fill in The Blank. I will guide you through a tutorial that will explain the basics of Freewriter.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => {
                console.log('Start tutorial');
                setShowIntro(false)}}
              variant="contained"
              sx={{
                bgcolor: 'black',
                color: 'white',
                fontFamily: 'PixelSplitter, monospace',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'grey.800',
                },
              }}
            >
              START TUTORIAL
            </Button>
            <Button
              onClick={handleSkipTutorial}
              sx={{
                color: 'black',
                fontFamily: 'PixelSplitter, monospace',
                textTransform: 'none',
								
              }}
            >
              SKIP TUTORIAL &gt;
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}