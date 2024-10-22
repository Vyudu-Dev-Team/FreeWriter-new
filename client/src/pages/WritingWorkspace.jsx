import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Box } from '@mui/material';
import TextEditor from '../components/TextEditor';
import SceneSequelTool from '../components/SceneSequelTool';
import AIAssistant from '../components/AIAssistant';
import ProgressTracker from '../components/ProgressTracker';
import Outline from '../components/Outline';
import SketchGenerator from '../components/SketchGenerator';
import SoundEffects from '../components/SoundEffects';
import axios from 'axios';

const WritingWorkspace = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`/api/stories/${storyId}`);
      setStory(response.data);
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching story:', error);
      // TODO: Handle error (e.g., redirect to 404 page)
    }
  };

  const handleContentChange = async (newContent) => {
    setContent(newContent);
    try {
      await axios.put(`/api/stories/${storyId}/content`, { content: newContent });
    } catch (error) {
      console.error('Error saving content:', error);
      // TODO: Handle error (e.g., show error message to user)
    }
  };

  if (!story) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '70vh' }}>
            <TextEditor
              storyId={storyId}
              initialContent={content}
              onContentChange={handleContentChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '70vh', overflowY: 'auto' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <ProgressTracker storyId={storyId} />
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Outline storyId={storyId} writingMode={story.writingMode} />
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <SceneSequelTool storyId={storyId} />
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <AIAssistant storyId={storyId} currentContent={content} />
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <SketchGenerator />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <SoundEffects />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WritingWorkspace;