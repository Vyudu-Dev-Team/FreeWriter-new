import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import TextEditor from './TextEditor';
import AIAssistant from './AIAssistant';
import ProgressTracker from './ProgressTracker';

const WritingWorkspace = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stories/${storyId}`);
      setStory(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Failed to load story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = async (newContent) => {
    try {
      await axios.put(`/api/stories/${storyId}`, { content: newContent });
      setStory({ ...story, content: newContent });
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '70vh' }}>
            <TextEditor
              initialContent={story.content}
              onContentChange={handleContentChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '70vh', overflowY: 'auto' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <ProgressTracker storyId={storyId} />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <AIAssistant storyId={storyId} />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WritingWorkspace;