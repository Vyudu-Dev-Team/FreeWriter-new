import React from 'react';
import { Box, Typography, Button, Container, Paper, IconButton } from '@mui/material';
import VigilIntro from './VigilIntro';



function FreewriterStory({handleSkipTutorial}) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container
        sx={{
          width: '100%',
          py: 4,
          position: 'absolute',
          top: 0,
					textAlign: 'end'
        }}
      >
        
        <Button
				onClick={handleSkipTutorial}	
          sx={{
            color: 'white',
            fontFamily: 'PixelSplitter, monospace',
			
          }}
        >
          SKIP TUTORIAL &gt;
        </Button>
      </Container>

      <Box
			Box
			component="img"
			src="/assets/images/tutorial-image.svg"
			alt="Round Vigil"
        sx={{
          width: '80%',
          maxWidth: '800px',
          boxShadow: 3,
          position: 'relative',
          mt: 10,
        }}
      >

      </Box>

      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 3,
          mt: 4,
          width: '90%',
          maxWidth: '1000px',
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
					zIndex: 111,
					top: -30,
					position:'relative'
        }}
      >
        <Box
          component="img"
          src="/assets/images/vigil.svg"
          alt="Character"
          sx={{
            height: '130px',
            width: '160px',
            objectFit: 'cover',
            objectPosition: 'top'
          }}
        />
        <Typography
          sx={{
            color: 'black',
            fontFamily: 'PixelSplitter, monospace',
            fontSize: '14px',
						textAlign: 'start',
						width: '80%',
						ml: 4
          }}
        >
          LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. NUNC MAXIMUS LACINIA EROS, AT PELLENTESQUE MI HENDRERIT EU.S PLATFORM
          LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. NUNC MAXIMUS LACINIA EROS, AT PELLENTESQUE MI HENDRERIT EU.S PLATFORM
        </Typography>
      </Box>
    </Box>
  );
}

export default function ParentComponent({handleSkipTutorial,}) {
  const [showIntro, setShowIntro] = React.useState(true);

  if (showIntro) {
    return <VigilIntro setShowIntro={setShowIntro} handleSkipTutorial={handleSkipTutorial}  />;
  }

  return <FreewriterStory handleSkipTutorial={handleSkipTutorial}  />;
}