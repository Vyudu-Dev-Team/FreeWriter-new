import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function AIAssistant() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to conversation
    const newMessage = {
      text: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, newMessage]);
    setUserInput('');

    // TODO: Implement AI response logic
    // This is a placeholder for the AI response
    setTimeout(() => {
      const aiResponse = {
        text: "I'm your AI writing assistant. I'm here to help you with your writing journey.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setConversation(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#1a1a1a',
      color: '#fff'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#490BF4', 
        display: 'flex', 
        alignItems: 'center',
        gap: 2
      }}>
        <SmartToyIcon sx={{ color: '#D8F651' }} />
        <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter, monospace' }}>
          AI Writing Assistant
        </Typography>
      </Box>

      {/* Chat Area */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {conversation.map((message, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              maxWidth: '70%',
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: message.sender === 'user' ? '#490BF4' : '#2a2a2a',
              color: '#fff',
              borderRadius: 2
            }}
          >
            <Typography>{message.text}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 2, 
          bgcolor: '#2a2a2a',
          display: 'flex',
          gap: 2
        }}
      >
        <TextField
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask your AI assistant..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: '#490BF4',
              },
              '&:hover fieldset': {
                borderColor: '#D8F651',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#D8F651',
              },
            },
          }}
        />
        <Button 
          type="submit"
          variant="contained"
          sx={{
            bgcolor: '#D8F651',
            color: '#490BF4',
            fontFamily: 'PixelSplitter, monospace',
            '&:hover': {
              bgcolor: '#c1dd47',
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
} 