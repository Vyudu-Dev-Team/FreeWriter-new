import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const WritingAnalytics = ({ storyId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [storyId]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/stories/${storyId}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!analytics) {
    return <Typography>No analytics data available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Writing Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Word Count Over Time</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.wordCountHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wordCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Writing Session Duration</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.sessionDurations}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Most Used Words</Typography>
            <ul>
              {analytics.mostUsedWords.map((word, index) => (
                <li key={index}>{word.word}: {word.count} times</li>
              ))}
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Sentiment Analysis</Typography>
            <Typography>Overall Sentiment: {analytics.sentimentAnalysis.overall}</Typography>
            <Typography>Positive: {analytics.sentimentAnalysis.positive}%</Typography>
            <Typography>Neutral: {analytics.sentimentAnalysis.neutral}%</Typography>
            <Typography>Negative: {analytics.sentimentAnalysis.negative}%</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WritingAnalytics;