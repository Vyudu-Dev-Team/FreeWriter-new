import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StoryMapComponent from './components/StoryMapComponent';
import StoryMap from './components/StoryMap';
import DeckManager from './components/DeckManager';
import WritingWorkspace from './components/WritingWorkspace';
import PrivateRoute from './components/PrivateRoute';
// import NotificationCenter from './components/NotificationCenter';
import BadgeDisplay from './components/BadgeDisplay';
import SketchGenerator from './components/SketchGenerator';
import FeedbackForm from './components/FeedbackForm';
import Onboarding from './components/Onboarding';
import { AppProvider } from './contexts/AppContext';
import ProfilePage from './components/profileSetup';
import Component from './components/component';


function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/devtest" element={<Component />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/story-map" element={<StoryMapComponent />} />
            <Route path="/story-map/:storyId" element={<StoryMap />} />
            <Route path="/deck" element={<PrivateRoute><DeckManager /></PrivateRoute>} />
            <Route path="/write/:storyId" element={<PrivateRoute><WritingWorkspace /></PrivateRoute>} />
            {/* <Route path="/notifications" element={<PrivateRoute><NotificationCenter /></PrivateRoute>} /> */}
            <Route path="/badges" element={<PrivateRoute><BadgeDisplay /></PrivateRoute>} />
            <Route path="/sketch" element={<SketchGenerator />} />
            <Route path="/feedback" element={<PrivateRoute><FeedbackForm /></PrivateRoute>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;