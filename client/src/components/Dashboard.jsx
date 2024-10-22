import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';

function Dashboard() {
  const { stories, loading, error, fetchStories, createStory } = useStory();
  const [openDialog, setOpenDialog] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleCreateStory = async () => {
    try {
      await createStory(newStoryTitle);
      setOpenDialog(false);
      setNewStoryTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Stories
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Tooltip title="Create a new story and start writing">
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
          Create New Story
        </Button>
      </Tooltip>
      <Grid container spacing={3}>
        {stories.map(story => (
          <Grid item xs={12} sm={6} md={4} key={story._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{story.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(story.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Continue writing your story">
                  <Button size="small" component={RouterLink} to={`/write/${story._id}`}>
                    Write
                  </Button>
                </Tooltip>
                <Tooltip title="View and edit your story's structure">
                  <Button size="small" component={RouterLink} to={`/story-map/${story._id}`}>
                    Story Map
                  </Button>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Story</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Story Title"
            fullWidth
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateStory} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;