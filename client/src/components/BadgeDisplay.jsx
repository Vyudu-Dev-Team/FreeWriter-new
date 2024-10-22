import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
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
    <div>
      <Typography variant="h6">Your Badges</Typography>
      <Grid container spacing={2}>
        {badges.map(badge => (
          <Grid item xs={6} sm={4} md={3} key={badge._id}>
            <Card>
              <CardContent>
                <Avatar src={badge.badge.imageUrl} alt={badge.badge.name} />
                <Typography variant="subtitle1">{badge.badge.name}</Typography>
                <Typography variant="body2">{badge.badge.description}</Typography>
                <Typography variant="caption">Awarded: {new Date(badge.awardedAt).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BadgeDisplay;