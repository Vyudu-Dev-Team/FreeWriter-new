import React, { useState } from 'react';
import {
	Box,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Card,
  Avatar,
  LinearProgress,
  createTheme,
  ThemeProvider,
  styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Icons } from '../utils/icon';

// Custom styled components


const ChatBubble = styled(Paper)(({ isUser }) => ({
  padding: isUser ? '12px 16px' : '16px',
  margin: '8px 0',
  maxWidth: '85%',
  backgroundColor: isUser ? '#1a1a1a' : '#2a2a2a',
  color: '#fff',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  borderRadius: isUser ? '12px 12px 0 12px' : '12px 12px 12px 0',
  border: '1px solid #333',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
}));

const StatsCard = styled(Paper)({
  backgroundColor: '#000',
  border: '1px solid #333',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '16px',
  color: '#fff',
  '&:hover': {
    borderColor: '#444',
  }
});

const CustomProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#1a1a1a',
  '.MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundImage: 'linear-gradient(90deg, #6c5ce7, #b8ff57)',
  }
}));

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    primary: {
      main: '#6c5ce7',
    },
    secondary: {
      main: '#b8ff57',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
  },
});

const FlipCard = ({ title, color, icon: Icon, back, size }) => {
	
	return (
		<Box
			sx={{
				width: size === 'small	' ? 100 : 180,
				height: size === 'small' ? 160 : 300,
				pt: 3
			}}
			
			>
			<Box

				sx={{
					position: 'relative',
					width: size === 'small' ? '40%' : '100%',
					height: '100%',
					transformStyle: 'preserve-3d',
					transition: 'transform 0.6s',
					'&: hover': {
						transform: 'scale(1)'
					}
				}}
			>
				{/* Front of card */}
				<Box
					sx={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						backfaceVisibility: 'hidden',
						bgcolor: color,
						borderRadius: 1,
						border: '4px solid',
						borderColor: `#000`,
						boxShadow: `0 0 0 10px ${color}`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 2,
					}}
					>
					<Typography
						sx={{
							color: color === '#D8F651' ? 'black' : 'white',
							fontFamily: 'PixelSplitter, monospace',
							fontSize: size === 'small'? '10px' : '1rem',
							textAlign: 'center',
						}}
					>
						{title}
					</Typography>
					<Icon
						sx={{
							fontSize: '4rem',
							color: color === '#D8F651' ? 'black' : 'white',
						}}
						/>
				</Box>

				{/* Back of card */}
				<Box
					sx={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						backfaceVisibility: 'hidden',
						bgcolor: color,
						borderRadius: 2,
						border: '4px solid',
						borderColor: `${color === '#D8F651' ? 'black' : color}`,
						transform: 'rotateY(180deg)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						pt: 2,
						px: 2,
						gap: 1
					}}
					>
					
				</Box>
			</Box>
		</Box>
	);
};

export default function CardGeneratorInterface() {
	const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
		{ text: "Welcome to the AI Card Generator. How can I help you create cards today?", isUser: false },
  ]);
	
	const cards = [
		{
			title: "CHARACTER", color: "#490BF4", icon: Icons.CharacterIcon, back: [
				{ title: "CHARACTER NAME", content: 'A brave warrior known for their unmatched skills.' },
				{ title: "GOAL", content: 'To unite the fractured kingdoms through diplomacy.' },
				{ title: "STRENGTH", content: 'Exceptional combat skills and strategic thinking.' },
				{ title: "WEAKNESS", content: 'A tendency to trust too easily.' }
			]
		},
		{
			title: "WORLD", color: "#D8F651", icon: Icons.WorldIcon, back: [
				{ title: "WORLD", content: 'A richly detailed setting that influences the narrative and character development. The world is filled with diverse cultures, landscapes, and histories that shape the characters’ experiences and conflicts. From the towering mountains to the vast oceans, every element of this world plays a crucial role in the unfolding story, providing a backdrop that is as dynamic and engaging as the characters themselves.' }
			]
		},
		{
			title: "CONFLICT", color: "rgba(102, 0, 210, 1)", icon: Icons.ConflictIcon, back: [
				{ title: "INCIDING INCIDENT", content: 'The event that triggers the main conflict.' },
				{ title: "CONFLICT", content: 'The central struggle between opposing forces.' },
				{ title: "RESOLUTION", content: 'The outcome of the conflict, providing closure.' }
			]
		}
	];

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box 
        sx={{ 
          flexGrow: 1, 
          height: '100vh', 
          bgcolor: '#000',
          backgroundImage: 'url("/subtle-pattern.png")', // You would need to add this texture
          overflow: 'hidden' 
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Left Panel - Generated Cards */}
          <Grid item xs={12} md={3} sx={{ height: '100%', width: '100%', borderRight: '1px solid #333', p: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                mb: 3,
                letterSpacing: '0.1em',
                fontWeight: 600 
              }}
            >
              GENERATED CARDS
            </Typography>

            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '90%', alignContent: 'center', gap: 2 }}>
							<Box sx={{mx: 'auto'}}>
								<FlipCard {...cards[0]} />
							</Box>
                <Box sx={{ display: 'flex', width: '90%', height: 'auto' }}>
								{cards.map((card, index) => (
						<Box
							key={card.title}
							sx={{
								 width: '110px',
								 mb: 2,
								 transition: 'all 0.6s',
							}}
						>
							<FlipCard
								{...card}
								
								size={'small'}
							/>
						</Box>
					))}
                </Box>
            </Box>
          </Grid>

          {/* Middle Panel - Chat Interface */}
          <Grid item xs={12} md={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                backgroundImage: 'url("/world-map.png")', // You would need to add this texture
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1a1a1a',
              }}
            >
              {/* Chat Messages */}
              <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, index) => (
                  <ChatBubble key={index} isUser={msg.isUser}>
                    {!msg.isUser && (
                      <Avatar sx={{ bgcolor: '#6c5ce7', width: 32, height: 32 }}>
                        <SmartToyIcon sx={{ width: 20, height: 20 }} />
                      </Avatar>
                    )}
                    <Typography variant="body2">{msg.text}</Typography>
                  </ChatBubble>
                ))}
              </Box>

              {/* Chat Input */}
              <Box 
                sx={{ 
                  mt: 2,
                  p: 2,
                  borderTop: '1px solid #333',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#1a1a1a',
                        '& fieldset': {
                          borderColor: '#333',
                        },
                        '&:hover fieldset': {
                          borderColor: '#444',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6c5ce7',
                        },
                      },
                    }}
                  />
                  <IconButton 
                    onClick={handleSend}
                    sx={{ 
                      bgcolor: '#6c5ce7',
                      '&:hover': { 
                        bgcolor: '#5a4bd4',
                      },
                      width: 48,
                      height: 48,
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Panel - Stats */}
          <Grid item xs={12} md={3} sx={{ height: '100%', borderLeft: '1px solid #333', p: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                mb: 3,
                letterSpacing: '0.1em',
                fontWeight: 600 
              }}
            >
              STORY STATS
            </Typography>
            
            <StatsCard>
              <Typography variant="overline" sx={{ color: '#666', letterSpacing: 2 }}>
                WRITING PROGRESS
              </Typography>
              <CustomProgress variant="determinate" value={75} sx={{ my: 2 }} />
              <Typography variant="caption" sx={{ color: '#666', display: 'block', textAlign: 'right' }}>
                75% Complete
              </Typography>
            </StatsCard>

            <StatsCard>
              <Typography variant="overline" sx={{ color: '#666', letterSpacing: 2 }}>
                CARDS GENERATED
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                <Typography variant="h3" sx={{ color: '#6c5ce7', fontWeight: 600 }}>
                  24
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  cards
                </Typography>
              </Box>
            </StatsCard>

            <StatsCard>
              <Typography variant="overline" sx={{ color: '#666', letterSpacing: 2 }}>
                ACTIVE TIME TODAY
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                <Typography variant="h3" sx={{ color: '#b8ff57', fontWeight: 600 }}>
                  2.5
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  hours
                </Typography>
              </Box>
            </StatsCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}