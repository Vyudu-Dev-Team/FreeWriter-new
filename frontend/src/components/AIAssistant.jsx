import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const AIAssistant = ({ storyId }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [assistanceType, setAssistanceType] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/assist', {
        storyId,
        userInput,
        assistanceType
      });
      setAiResponse(response.data.suggestion);
    } catch (error) {
      console.error('Error getting AI assistance:', error);
      setAiResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        AI Assistant (Virgil)
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assistance Type</InputLabel>
          <Select
            value={assistanceType}
            onChange={(e) => setAssistanceType(e.target.value)}
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="character">Character Development</MenuItem>
            <MenuItem value="plot">Plot Ideas</MenuItem>
            <MenuItem value="setting">Setting Description</MenuItem>
            <MenuItem value="dialogue">Dialogue Suggestions</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask Virgil for writing assistance..."
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Getting assistance...' : 'Get Assistance'}
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