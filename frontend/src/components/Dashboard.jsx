import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  // ... (previous state and useEffect)

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: isMobile ? 2 : 3 }}>
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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{story.title}</Typography>
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
      {/* ... (Dialog component) */}
    </Container>
  );
}

export default Dashboard;