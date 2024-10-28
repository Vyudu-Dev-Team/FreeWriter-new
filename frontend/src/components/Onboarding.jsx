import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WelcomeStep = () => (
  <Box textAlign="center">
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.75rem' }, color: 'primary.main' }}>
      Welcome to FreeWriter!
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.5 }}>
      Your journey to creative writing starts here. Let's get you set up in just a few steps.
    </Typography>
  </Box>
);

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
        return <WelcomeStep />;
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
    <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', py: 4 }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: 400,
        p: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.100',
        bgcolor: 'background.paper'
      }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel={!isMobile}
          sx={{ mb: 3, '& .MuiStepLabel-label': { fontSize: '0.875rem', color: 'text.secondary' } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{!isMobile && label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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
