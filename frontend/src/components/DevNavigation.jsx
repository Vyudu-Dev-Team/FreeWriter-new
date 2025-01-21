import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DevNavigation() {
  const navigate = useNavigate();

  const routes = [
    // Introduction
    { path: '/', name: 'Introduction' },
    { path: '/introduction', name: 'Introduction (Alternate)' },
    { path: '/virgil-intro', name: 'Virgil Introduction' },
    
    // Authentication
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/verify-email', name: 'Email Verification' },
    { path: '/forgot-password', name: 'Forgot Password' },
    
    // User Setup
    { path: '/onboarding', name: 'Onboarding' },
    { path: '/profile', name: 'Profile Setup' },
    { path: '/dashboard', name: 'Dashboard' },
    
    // Main Features
    { path: '/prompt', name: 'Prompt Page' },
    { path: '/story-map', name: 'Story Map Component' },
    { path: '/deck', name: 'Deck Manager' },
    
    // Writing Environment
    { path: '/write', name: 'Writing Workspace' },
    { path: '/virgil-chat', name: 'Virgil Chat' },
    { path: '/text-editor', name: 'Text Editor' },
    { path: '/writing-analytics', name: 'Writing Analytics' },
    { path: '/writing-prompts', name: 'Writing Prompts' },
    { path: '/sketch', name: 'Sketch Generator' },
    { path: '/ai-assistant', name: 'AI Assistant' },
    
    // Other Features
    { path: '/badges', name: 'Badge Display' },
    { path: '/feedback', name: 'Feedback Form' },
    { path: '/fcm-test', name: 'FCM Test' },
    { path: '/userpage', name: 'User Page' },
    { path: '/home', name: 'Home' }
  ];

  return (
    <Box 
      sx={{ 
        p: 4, 
        maxWidth: 800, 
        margin: '0 auto',
        minHeight: '100vh',
        bgcolor: '#1a1a1a'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontFamily: 'PixelSplitter, monospace',
          color: '#D8F651',
          textAlign: 'center'
        }}
      >
        Developer Navigation
      </Typography>
      
      <List>
        {routes.map((route) => (
          <ListItem key={route.path} disablePadding>
            <ListItemButton 
              onClick={() => navigate(route.path)}
              sx={{
                bgcolor: '#490BF4',
                color: '#fff',
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: '#3908b3',
                },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateX(10px)',
                  bgcolor: '#3908b3',
                }
              }}
            >
              <ListItemText 
                primary={route.name} 
                secondary={route.path}
                primaryTypographyProps={{
                  fontFamily: 'Quicksand, monospace',
                  fontWeight: 'bold'
                }}
                secondaryTypographyProps={{
                  color: '#D8F651'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 