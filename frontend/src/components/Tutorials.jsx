import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Paper,
  Card,
  CardContent,
  Container
} from '@mui/material';
import VigilIntro from './VigilIntro';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import SettingsIcon from '@mui/icons-material/Settings';


function FreewriterStory({handleSkipTutorial}) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        minHeight: '100vh',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
			  bgcolor='white'
        sx={{
          width: '80%',
          maxWidth: '800px',
          boxShadow: 3,
          position: 'relative',
          mt: 10,
        }}
      >
      <Box
          sx={{
            width: '100%',
            maxWidth: 800,
            bgcolor: 'white',
            borderRadius: 2,
            p: 3,
            mb: 2,
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              sx={{
                color: '#D8F651',
                fontFamily: 'PixelSplitter, monospace',
                fontSize: '1.5rem',
              }}
            >
              FREEWRITER
            </Typography>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontFamily: 'PixelSplitter, monospace',
            }}
          >
            TELL A STORY ABOUT...
          </Typography>

          {/* Prompts */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Card
              sx={{
                bgcolor: 'black',
                color: 'white',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
              }}
              onClick={() => setSelectedPrompt(0)}
            >
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'PixelSplitter, monospace', fontSize: '0.9rem' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
                <StarOutlineIcon sx={{ color: 'white' }} />
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {[1, 2].map((index) => (
                <Card
                  key={index}
                  sx={{
                    border: '1px solid black',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                    flex: 1,
                  }}
                  onClick={() => setSelectedPrompt(index)}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: 'PixelSplitter, monospace', fontSize: '0.9rem' }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <StarOutlineIcon />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Choose Prompt Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#490BF4',
                color: 'white',
                fontFamily: 'PixelSplitter, monospace',
                textTransform: 'none',
                '&:hover': { bgcolor: '#3a09c3' },
              }}
            >
              CHOOSE THIS PROMPT
            </Button>
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      
        {/* Category Cards */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            maxWidth: 800,
            width: '100%',
            zIndex: 1,
            position: 'relative',
            bottom: 50,
            gap: 2,
            bgcolor: 'black',
          }}
        >
          {['CHARACTER', 'WORLD', 'CONFLICT'].map((category, index) => (
            <Paper
              key={category}
              sx={{
                width: 180,
                height: 270,
                bgcolor: index === 1 ? '#D8F651' : '#490BF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: index === 1 ? 'black' : 'white',
                fontFamily: 'PixelSplitter, monospace',
                fontSize: '1rem',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
              }}
            >
              {category}
            </Paper>
          ))}
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





// export default function FreewriterTutorial() {
//   const [selectedPrompt, setSelectedPrompt] = useState(null);

//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         height: '100vh',
//         bgcolor: 'black',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'relative',
//         p: 3,
//       }}
//     >
//       {/* Skip Tutorial Button */}
//       <Button
//         sx={{
//           position: 'absolute',
//           top: 20,
//           right: 20,
//           color: 'white',
//           fontFamily: 'PixelSplitter, monospace',
//           textTransform: 'none',
//         }}
//       >
//         SKIP TUTORIAL &gt;
//       </Button>

//       {/* Main Container */}
      

//       {/* Bottom Section */}
//       <Box
//         sx={{
//           width: '100%',
//           maxWidth: 800,
//           position: 'relative',
//           height: 300,
//         }}
//       >
//         {/* Category Cards */}
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             position: 'absolute',
//             bottom: 0,
//             left: 0,
//             right: 0,
//           }}
//         >
//           {['CHARACTER', 'WORLD', 'CONFLICT'].map((category, index) => (
//             <Paper
//               key={category}
//               elevation={3}
//               sx={{
//                 width: 200,
//                 height: 300,
//                 bgcolor: index === 1 ? '#D8F651' : '#490BF4',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: index === 1 ? 'black' : 'white',
//                 fontFamily: 'PixelSplitter, monospace',
//                 fontSize: '1rem',
//                 cursor: 'pointer',
//                 '&:hover': { opacity: 0.9 },
//               }}
//             >
//               {category}
//             </Paper>
//           ))}
//         </Box>

//         {/* Bottom Card */}
//         <Paper
//           sx={{
//             width: '100%',
//             height: 210,
//             bgcolor: 'white',
//             borderRadius: 2,
//             p: 3,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 3,
//             position: 'absolute',
//             top: 0,
//             zIndex: 2,
//           }}
//         >
//           <Box
//             component="img"
//             src="/placeholder.svg?height=100&width=100"
//             alt="Character"
//             sx={{
//               width: 100,
//               height: 100,
//               objectFit: 'cover',
//             }}
//           />
//           <Typography
//             sx={{
//               fontFamily: 'PixelSplitter, monospace',
//               fontSize: '0.9rem',
//             }}
//           >
//             LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. NUNC MAXIMUS LACINIA EROS, AT PELLENTESQUE MI HENDRERIT EU.S PLATFORM
//           </Typography>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }

export default function ParentComponent({handleSkipTutorial,}) {
  const [showIntro, setShowIntro] = React.useState(true);

  if (showIntro) {
    return <VigilIntro setShowIntro={setShowIntro} handleSkipTutorial={handleSkipTutorial}  />;
  }

  return <FreewriterStory handleSkipTutorial={handleSkipTutorial}  />;
}