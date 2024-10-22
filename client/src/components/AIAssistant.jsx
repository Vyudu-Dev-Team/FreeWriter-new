import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const AIAssistant = ({ storyId, currentContent }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/ai/assist', {
        storyId,
        currentContent,
        userInput
      });
      setAiResponse(response.data.suggestion);
    } catch (error) {
      console.error('Error getting AI assistance:', error);
      setAiResponse('Sorry, I encountered an error. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        AI Assistant (Virgil)
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask Virgil for writing assistance..."
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Get Assistance
        </Button>
      </form>
      {aiResponse && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1">{aiResponse}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AIAssistant;