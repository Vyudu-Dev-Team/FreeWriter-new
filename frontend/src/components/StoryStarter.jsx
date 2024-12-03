import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function FreewriterStory() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: 'black',
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Typography
        sx={{
          color: '#D8F651',
          fontFamily: 'PixelSplitter, monospace',
          fontSize: { xs: '24px', md: '32px' },
          position: 'absolute',
          top: '20px',
          left: '20px',
        }}
      >
        FREEWRITER
      </Typography>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, md: 8 },
          maxWidth: '1000px',
          width: '100%',
          px: 3,
        }}
      >
        {/* Character Image */}
        <Box
          component="img"
          src="/assets/images/vigil.svg?height=400&width=400"
          alt="Character with pen and floating papers"
          sx={{
            width: { xs: '200px', md: '400px' },
            height: 'auto',
          }}
        />

        {/* Text and Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontFamily: 'PixelSplitter, monospace',
              fontSize: { xs: '24px', md: '32px' },
              lineHeight: 1.4,
              mb: 4,
            }}
          >
            NOW, LETS{' '}
            <Box
              component="span"
              sx={{
                color: '#D8F651',
              }}
            >
              START
            </Box>
            <br />
            YOUR NEW STORY
          </Typography>

          {/* Button */}
          <Button
            variant="contained"
            sx={{
              bgcolor: 'rgba(73, 11, 244, 1)',
              color: 'white',
              fontFamily: 'PixelSplitter, monospace',
              fontSize: '18px',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: '#c2e046',
              },
              textTransform: 'none',
              borderRadius: 1,
            }}
          >
            LET'S GO
          </Button>
        </Box>
      </Box>
    </Box>
  );
}