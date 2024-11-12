import React, { useState } from 'react';
import {
  MenuBook as MenuBookIcon,
  Refresh as RefreshIcon,
  QuestionMark as QuestionMarkIcon,
  Landscape as LandscapeIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../utils/icon';

const WritingModeStep = ({ writingMode, setWritingMode }) => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 2 }}>
      Choose Your Writing Mode
    </Typography>
    <FormControl component="fieldset">
      <RadioGroup value={writingMode} onChange={(e) => setWritingMode(e.target.value)} sx={{ gap: 1 }}>
        {['freeform', 'guided', 'structured'].map((mode) => (
          <FormControlLabel
            key={mode}
            value={mode}
            control={<Radio />}
            label={mode.charAt(0).toUpperCase() + mode.slice(1)}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9375rem', color: 'text.primary' } }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  </Box>
);

const CreateStoryStep = ({ storyTitle, storyDescription, setStoryTitle, setStoryDescription }) => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 2 }}>
      Create Your First Story
    </Typography>
    <TextField
      fullWidth
      label="Story Title"
      value={storyTitle}
      onChange={(e) => setStoryTitle(e.target.value)}
      margin="normal"
      required
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1.5,
          backgroundColor: 'grey.50',
          '&:hover fieldset': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
        },
      }}
    />
    <TextField
      fullWidth
      label="Story Description"
      value={storyDescription}
      onChange={(e) => setStoryDescription(e.target.value)}
      margin="normal"
      multiline
      rows={4}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1.5,
          backgroundColor: 'grey.50',
          '&:hover fieldset': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
        },
      }}
    />
  </Box>
);

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [writingMode, setWritingMode] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const steps = ['Welcome', 'Choose Writing Mode', 'Create First Story'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <StoryDevelopment />;
      case 1:
        return <WritingModeStep writingMode={writingMode} setWritingMode={setWritingMode} />;
      case 2:
        return <CreateStoryStep
          storyTitle={storyTitle}
          storyDescription={storyDescription}
          setStoryTitle={setStoryTitle}
          setStoryDescription={setStoryDescription}
        />;
      default:
        return // onboarding logic
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', }}>
      <Box sx={{ 
        width: '100%', 
        height: '100vh',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.100',
        bgcolor: 'background.paper'
      }}>
      

        <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'text.secondary',
              borderRadius: 1.5,
              px: 3,
              py: 1
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={(activeStep === 1 && !writingMode) || (activeStep === 2 && !storyTitle)}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.9375rem',
              fontWeight: 500,
              borderRadius: 1.5,
              px: 3,
              py: 1
            }}
          >
            {activeStep === steps.length - 1 ? 'Start Writing' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}


const StoryCard = ({ title, icon: Icon }) => (
  <Card
    sx={{
      bgcolor: 'black',
      color: 'white',
      width: 280,
      height: 400,
      borderRadius: 2,
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    }}
  >
    <CardContent
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
       
      }}
    >
      <Icon sx={{ fontSize: 64, }} />
      <Typography
        sx={{
          textAlign: 'center',
          fontFamily: 'PixelSplitter, monospace',
          fontSize: '18px',
          
          width: 200,
        }}
      >
        {title}
      </Typography>
      <QuestionMarkIcon sx={{ fontSize: 32, color: 'black', bgcolor: 'white', borderRadius: 50, p: 1 }} />
    </CardContent>
  </Card>
);

const StoryDevelopment = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#E84A1C',
        position: 'relative',
        p: 4,
      }}
    >
      {/* Book Icon */}
      <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
        <MenuBookIcon sx={{ color: 'white', fontSize: 40 }} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 1,
            fontFamily: 'PixelSplitter, monospace',
            color: 'white',
            fontSize: { xs: '24px', sm: '32px' },
          }}
        >
          NOW, LET&apos;S{' '}
          <span style={{ color: '#D8F651' }}>DEVELOP YOUR STORY</span>
        </Typography>

        <Typography
          sx={{
            mb: 6,
            color: 'white',
            fontFamily: 'PixelSplitter, monospace',
            fontSize: '16px',
          }}
        >
          CHOOSE A STORYTELLING STRUCTURE:
        </Typography>

        {/* Cards Container */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 4,
          }}
        >
          <StoryCard
            title='THE HERO"S JOURNEY'
            icon={Icons.MountainRefreshIcon}
          />
          <StoryCard
            title="THE THREE-ACT STRUCTURE"
            icon={TimerIcon}
          />
        </Box>

        {/* Refresh Button */}
        <IconButton
          sx={{
            color: 'white',
            mb: 4,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <RefreshIcon sx={{ fontSize: 32 }} />
        </IconButton>

        {/* Continue Button */}
        <Button
          variant="contained"
          sx={{
            bgcolor: 'white',
            color: 'black',
            position: 'absolute',
            bottom: 20,
            right: 20,
            fontFamily: 'PixelSplitter, monospace',
            fontSize: '14px',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          CLICK HERE TO CONTINUE
        </Button>
      </Box>
    </Box>
  );
};

