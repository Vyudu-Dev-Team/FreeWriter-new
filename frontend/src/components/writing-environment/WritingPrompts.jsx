import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';

const WritingPrompts = () => {
  const [prompt, setPrompt] = useState('');

  const fetchPrompt = async () => {
    try {
      const response = await axios.get('/api/writing-prompts');
      setPrompt(response.data.prompt);
    } catch (error) {
      console.error('Error fetching writing prompt:', error);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Writing Prompt</Typography>
      <Typography variant="body1" paragraph>{prompt}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={fetchPrompt}>Get New Prompt</Button>
        <Button variant="contained" color="primary">Use This Prompt</Button>
      </Box>
    </Paper>
  );
};

export default WritingPrompts;