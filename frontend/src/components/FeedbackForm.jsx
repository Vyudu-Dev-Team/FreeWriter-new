import React, { useState } from 'react';
import { TextField, Button, Snackbar, Typography, Rating, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [featureUsed, setFeatureUsed] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedback', { feedback, rating, featureUsed });
      setFeedback('');
      setRating(0);
      setFeatureUsed('');
      setOpen(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">We'd love to hear your feedback!</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Feature Used</InputLabel>
          <Select
            value={featureUsed}
            onChange={(e) => setFeatureUsed(e.target.value)}
          >
            <MenuItem value="writing-workspace">Writing Workspace</MenuItem>
            <MenuItem value="ai-assistant">AI Assistant</MenuItem>
            <MenuItem value="story-map">Story Map</MenuItem>
            <MenuItem value="card-system">Card System</MenuItem>
            <MenuItem value="progress-tracking">Progress Tracking</MenuItem>
          </Select>
        </FormControl>
        <Typography component="legend">Rate your experience:</Typography>
        <Rating
          name="user-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Feedback
        </Button>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Thank you for your feedback!"
      />
    </div>
  );
};

export default FeedbackForm;