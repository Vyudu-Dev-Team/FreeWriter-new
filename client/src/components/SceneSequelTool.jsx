import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const steps = ['Scene Goal', 'Conflict', 'Disaster', 'Reaction', 'Dilemma', 'Decision'];

const SceneSequelTool = ({ storyId, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepContent, setStepContent] = useState({});

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await axios.post(`/api/stories/${storyId}/scene-sequel`, stepContent);
        onComplete(stepContent);
      } catch (error) {
        console.error('Error saving scene/sequel:', error);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (event) => {
    setStepContent({
      ...stepContent,
      [steps[activeStep]]: event.target.value
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        <Typography>{steps[activeStep]}</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={stepContent[steps[activeStep]] || ''}
          onChange={handleInputChange}
          sx={{ mt: 1 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SceneSequelTool;