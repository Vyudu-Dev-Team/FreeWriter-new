import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Rating, Card, CardMedia } from '@mui/material';
import axios from 'axios';

const SketchGenerator = () => {
  const [description, setDescription] = useState('');
  const [sketchUrl, setSketchUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('/api/sketches/generate', { description });
      setSketchUrl(response.data.sketchUrl);
    } catch (error) {
      console.error('Error generating sketch:', error);
    }
  };

  const handleImprove = async () => {
    try {
      const response = await axios.post('/api/sketches/improve', { sketchUrl, feedback });
      setSketchUrl(response.data.improvedSketchUrl);
    } catch (error) {
      console.error('Error improving sketch:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Sketch Generator</Typography>
      <TextField
        fullWidth
        label="Describe your sketch"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleGenerate}>Generate Sketch</Button>
      
      {sketchUrl && (
        <Card sx={{ mt: 2 }}>
          <CardMedia
            component="img"
            height="256"
            image={sketchUrl}
            alt="Generated Sketch"
          />
          <Box sx={{ p: 2 }}>
            <Typography component="legend">Rate this sketch:</Typography>
            <Rating
              name="sketch-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <TextField
              fullWidth
              label="Feedback for improvement"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              margin="normal"
            />
            <Button variant="outlined" onClick={handleImprove}>Improve Sketch</Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default SketchGenerator;