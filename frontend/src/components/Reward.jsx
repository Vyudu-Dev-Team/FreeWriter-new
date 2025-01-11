import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star'
import { styled } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';


const RewardItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  color: '#fff',
  zIndex: 1,
})
const RetroTypography = styled(Typography)({
  fontFamily: '"Press Start 2P", monospace',
  textTransform: 'uppercase',
  textShadow: '0 0 10px rgba(255,255,255,0.5)',
  zIndex: 1,
})

const RetroButton = styled(Button)(({ theme, variant }) => ({
  fontFamily: '"PixelSplitter", monospace',
  padding: '1rem 2rem',
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  ...(variant === 'contained' && {
    backgroundColor: '#c9ff2e',
    color: '#1955d2',
    '&:hover': {
      backgroundColor: '#d4ff5e',
      boxShadow: '0 0 20px rgba(201, 255, 46, 0.5)',
    },
  }),
  ...(variant === 'outlined' && {
    backgroundColor: '#000',
    color: '#d4ff5e',
    border: '2px solid #fff',
    '&:hover': {
      backgroundColor: '#1a1a1a',
      borderColor: '#fff',
    },
  }),
}))

const theme = createTheme({
  typography: {
    fontFamily: 'PixelSplitter, monospace',
  },
});

const Reward = () => {
	const rewards = [
    { label: 'WILD CARDS POINTS', points: 700 },
    { label: 'NEW LEVEL ACHIEVED', points: 700 },
    { label: 'NEW BADGE ACHIEVED', points: 700 },
    { label: 'WRITING SCORE', points: 1700 },
    { label: 'TOTAL POINTS', points: 3000 },
  ]

  const navigate = useNavigate()
  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        background: "url('assets/images/starter-background.svg')",
        backgroundSize: '100% auto',
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
        <Box
          sx={{
						display: 'flex',
						justifyContent: 'space-between'
					}}
        >
            <Typography
                variant="h1"
                sx={{
								p: 4,
                color: '#D8F651',
                fontSize: '1.6rem',
                textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
							
                }}
            >
                FREE<span style={{ color: '#fff' }}>WRITER</span>
            </Typography>
      			<Box sx={{mr: 4}}>
							<IconButton sx={{ color: '#fff', }}>
								<QuestionMarkIcon sx={{ border: '1px solid #fff', borderRadius: 50, fontSize: '1.2rem' }} />
							</IconButton>
							<IconButton sx={{ color: '#fff' }}>
								<SettingsIcon sx={{ fontSize: '1.4rem' }} />
							</IconButton>
						</Box>
        </Box>
      
      <Typography sx={{
          color: '#D8F651',
          mt: 3,
          fontSize: '2.2rem',
          
        }}>CONGRATULATIONS!<br/> YOU ENDED ANOTHER STORY</Typography>
		<Stack spacing={2} width="40%" mx={'auto'} mt={3} mb={4} >
            {rewards.map((reward, index) => (
              <RewardItem key={index}>
                <RetroTypography
                  variant="body1"
                  sx={{
                    flex: 1,
                    fontSize: '1.2rem',
										fontFamily: 'PixelSplitter',
										textAlign: 'left'
                  }}
                >
                  {reward.label}
                </RetroTypography>
                <RetroTypography
                  variant="body1"
                  sx={{
										fontSize: '1.2rem',
										width: '10rem',
										textAlign: 'left'
                  }}
                >
										<StarIcon sx={{ color: '#c9ff2e', ml: 0, mr: 3, mt: 1  }} />
                  {reward.points}
                </RetroTypography>
              </RewardItem>
            ))}
          </Stack>

					<Stack direction="row" spacing={2} ml={'26%'} mb={4} width="45%">
            <RetroButton variant="contained" fullWidth>
              Write Another Story
            </RetroButton>
            <RetroButton variant="outlined" fullWidth>
              Check My Profile
            </RetroButton>
          </Stack>
        
    </Box>
  </ThemeProvider>
  );

 
};

export default Reward;


