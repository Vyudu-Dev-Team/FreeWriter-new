import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Icon,
  Modal,
  Avatar,
} from '@mui/material';
import { Icons } from '../utils/icon';

const PlotCard = ({ title, text, onClick, storyTitle }) => {
  const isSelected = storyTitle === title;
  return (
    <Card
      onClick={onClick}
      sx={{
        bgcolor: isSelected ? '#111' : '#E84A1C',
        pt: 2,
        color: 'white',
        width: '260px',
        height: '400px',
        textAlign: 'start',
        borderRadius: 2,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, background-color 0.2s',
        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
        '&:hover': {
          transform: 'scale(1.15)',

        },
      }}
    >
      <CardContent sx={{ height: '100%', p: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontFamily: 'PixelSplitter, monospace',
            fontSize: '1.5rem',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            opacity: 0.9,
            pt: 2,
          }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PlotPoints = () => {
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam maximus tortor erat, et pellentesque mi hendrerit eu.`;
  const [open, setOpen] = useState(false);
  const [storyTitle, setStoryTitle] = useState();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        position: 'relative',
        pb: 10,
        // Notebook lines background
        backgroundImage: 'repeating-linear-gradient(#fff, #fff 31px, #e0e0e0 31px, #e0e0e0 32px)',
        backgroundPosition: '0 50px', // Start after the title
      }}
    >
      {/* Book Icon */}
      <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
        <Icons.NoteIcon sx={{ color: '#E84A1C', fontSize: 40 }} />
      </Box>

      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          py: 6,
          fontFamily: 'PixelSplitter, monospace',
          fontSize: '24px',
        }}
      >
        FILL THE PLOT POINT PROMPTS
      </Typography>

      {/* Cards Container */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
            my: 6,
          }}
        >
          <PlotCard
            onClick={() => setStoryTitle('INCITING INCIDENT')}
            storyTitle={storyTitle}
            title="INCITING INCIDENT"
            text={loremIpsum}
          />
          <PlotCard
            onClick={() => setStoryTitle('CONFLICT')}
            storyTitle={storyTitle}
            title="CONFLICT"
            text={loremIpsum}
          />
          <PlotCard
            onClick={() => setStoryTitle('RESOLUTION')}
            storyTitle={storyTitle}
            title="RESOLUTION"
            text={loremIpsum}
          />
        </Box>

        {/* Card Done Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6, gap: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            sx={{
              color: 'black',
              px: 4,
              bgcolor: 'rgba(216, 246, 81, 1)',
              py: 1,
              fontFamily: 'PixelSplitter, monospace',
              '&:hover': {
                borderColor: 'black',
                bgcolor: 'rgba(216, 246, 81, 1)',
              },
            }}
          >
            VIEW STORYMAP
          </Button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="storymap-modal"
            aria-describedby="storymap-modal-description"
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '75%',
              maxHeight: '75vh',
              minHeight: '70vh',
              bgcolor: 'black',
              boxShadow: 24,
              p: 4,
              overflow: 'auto',
              borderRadius: 2
            }}>
              <Card
                sx={{
                  maxWidth: '100%',
                  bgcolor: 'black',
                  color: 'white',
                  height: '65vh',
                  border: '1px solid white',
                  borderRadius: 4,
                  position: 'relative',
                  p: 2,
                }}
              >
                <Box
                  component="img"
                  src="/assets/images/vigil.svg?height=80&width=100"
                  alt="Round Vigil"
                  sx={{

                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: 45,
                    left: 20,
                    imageRendering: 'pixelated',
                  }}
                >

                </Box>
                {/*  */}
                <CardContent sx={{ pl: 20, pt: 7 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'PixelSplitter, monospace',
                      fontSize: '1.15rem',
                      mb: 2,
                    }}
                  >
                    VIRGIL&apos;S FEEDBACK:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '1.1rem',
                      width: '90%'
                    }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, ut pellentesque mi hendrerit eu.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Modal>
          <Button
            variant="outlined"
            onClick={() => setStoryTitle('')}
            sx={{
              color: 'black',
              borderColor: 'black',
              px: 4,
              py: 1,
              fontFamily: 'PixelSplitter, monospace',
              '&:hover': {
                borderColor: 'black',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            CARD DONE
          </Button>
        </Box>
      </Container>

      {/* Character Avatar */}
      <Box
        component="img"
        src="/assets/images/round-vigil.svg"
        alt="Round Vigil"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >

      </Box>
    </Box>
  );
};

export default PlotPoints;