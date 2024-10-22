import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import axios from 'axios';

const BadgeDisplay = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await axios.get('/api/badges');
      setBadges(response.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Your Badges</Typography>
      <Grid container spacing={2}>
        {badges.length > 0 ? (
          badges.map(badge => (
            <Grid item xs={6} sm={4} md={3} key={badge._id}>
              <Card>
                <CardContent>
                  <Avatar src={badge.badge.imageUrl || '/assets/images/default-badge.svg'} alt={badge.badge.name} sx={{ width: 60, height: 60, margin: 'auto' }} />
                  <Typography variant="subtitle1" align="center">{badge.badge.name}</Typography>
                  <Typography variant="body2" align="center">{badge.badge.description}</Typography>
                  <Typography variant="caption" display="block" align="center">Awarded: {new Date(badge.awardedAt).toLocaleDateString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">You haven't earned any badges yet. Keep writing to unlock achievements!</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BadgeDisplay;