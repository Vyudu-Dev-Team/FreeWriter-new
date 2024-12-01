import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import Navbar from './components/commonComponents/Navbar';
import Login from './components/commonComponents/Login';
import Onboarding from './components/Onboarding';
import Register from './components/Register';

import Home from './components/Home';

import BadgeDisplay from './components/BadgeDisplay';
import Dashboard from './components/Dashboard';
import StoryMapComponent from './components/story-mapping/StoryMapComponent';
import StoryMap from './components/story-mapping/StoryMap';
import DeckManager from './components/DeckManager';

import WritingWorkspace from './components/writing-environment/WritingWorkspace';
import SketchGenerator from './components/writing-environment/SketchGenerator';

import PrivateRoute from './components/PrivateRoute';
// import NotificationCenter from './components/NotificationCenter';

import FeedbackForm from './components/FeedbackForm';

import MyStoriesScreen from './components/MyStoriesScreen';
import StoryWritingView from './components/StoryWritingView';

import { AppProvider } from './contexts/AppContext';
import ProfilePage from './components/profileSetup';
import TitleScreen from './components/SplashScreen';
import PromptSelectedPage from './components/PromptSelected';


function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<TitleScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            // forgot password
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/prompt" element={<PromptPage />} />
            <Route path="/prompt/selected" element={<PromptSelectedPage />} />
            <Route path="/story-map" element={<PrivateRoute><StoryMapComponent /></PrivateRoute>} />
            <Route path="/story-map/:storyId" element={<PrivateRoute><StoryMap /></PrivateRoute>} />
            <Route path="/deck" element={<PrivateRoute><DeckManager /></PrivateRoute>} />
            <Route path="/write" element={<StoryWritingView />} />
            <Route path="/write/:storyId" element={<PrivateRoute><WritingWorkspace /></PrivateRoute>} />
            {/* <Route path="/notifications" element={<PrivateRoute><NotificationCenter /></PrivateRoute>} /> */}
            <Route path="/badges" element={<PrivateRoute><BadgeDisplay /></PrivateRoute>} />
            <Route path="/stories" element={<MyStoriesScreen />} />
            <Route path="/sketch" element={<PrivateRoute><SketchGenerator /></PrivateRoute>} />
            <Route path="/feedback" element={<PrivateRoute><FeedbackForm /></PrivateRoute>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;