import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StoryMap from './components/StoryMap';
import DeckManager from './components/DeckManager';
import WritingWorkspace from './pages/WritingWorkspace';
import PrivateRoute from './components/PrivateRoute';
import NotificationCenter from './components/NotificationCenter';
import BadgeDisplay from './components/BadgeDisplay';
import SketchGenerator from './components/SketchGenerator';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/story-map/:storyId" element={<PrivateRoute><StoryMap /></PrivateRoute>} />
          <Route path="/deck" element={<PrivateRoute><DeckManager /></PrivateRoute>} />
          <Route path="/write/:storyId" element={<PrivateRoute><WritingWorkspace /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationCenter /></PrivateRoute>} />
          <Route path="/badges" element={<PrivateRoute><BadgeDisplay /></PrivateRoute>} />
          <Route path="/sketch" element={<PrivateRoute><SketchGenerator /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;