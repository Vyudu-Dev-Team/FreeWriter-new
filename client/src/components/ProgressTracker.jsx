import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import axios from 'axios';

const ProgressTracker = ({ storyId }) => {
  const [progress, setProgress] = useState(0);
  const [goal, setGoal] = useState(50000); // Default goal: 50,000 words

  useEffect(() => {
    fetchProgress();
  }, [storyId]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/api/stories/${storyId}/progress`);
      setProgress(response.data.progress);
      setGoal(response.data.goal);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      const response = await axios.put(`/api/stories/${storyId}/progress`, {
        progress: progress + 100 // Increment by 100 words for demo purposes
      });
      setProgress(response.data.progress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Writing Progress
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(progress / goal) * 100}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2">{progress} words</Typography>
        <Typography variant="body2">{goal} words goal</Typography>
      </Box>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleUpdateProgress}
        sx={{ mt: 1 }}
      >
        Update Progress
      </Button>
    </Box>
  );
};

export default ProgressTracker;