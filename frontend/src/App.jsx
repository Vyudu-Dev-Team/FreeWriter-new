import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import Navbar from './components/commonComponents/Navbar';
import Login from './components/commonComponents/Login';
import ForgotPassword from './components/ForgotPassword';
import Onboarding from './components/Onboarding';
import Register from './components/Register';
import EmailVerification from './components/EmailVerification';
import FCMTest from './components/FCMTest';

import Home from './components/Home';

import BadgeDisplay from './components/BadgeDisplay';
import Dashboard from './components/Dashboard';
import StoryMapComponent from './components/story-mapping/StoryMapComponent';
import StoryMap from './components/story-mapping/StoryMap';
import DeckManager from './components/DeckManager';
import PromptPage from './components/PromptPage';

import WritingWorkspace from './components/writing-environment/WritingWorkspace';
import SketchGenerator from './components/writing-environment/SketchGenerator';

import PrivateRoute from './components/PrivateRoute';
// import NotificationCenter from './components/NotificationCenter';

import FeedbackForm from './components/FeedbackForm';

import { AppProvider } from './contexts/AppContext';
import ProfilePage from './components/profileSetup';

import VirgilIntro from './components/VigilIntro';
import Introduction from './components/A1_initialScreens/Introduction';
import UserPage from './components/UserPage';

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {/* <Navbar /> */}
          <Routes>

            {/* INTRODUCTION */}
              <Route path="/" element={<Introduction />} />
              <Route path="/introduction" element={<Introduction />} />
              <Route path="/virgil-intro" element={<VirgilIntro />} />

            {/* END INTRODUCTION */}

            
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prompt" element={<PromptPage />} />
            <Route path="/story-map" element={<PrivateRoute><StoryMapComponent /></PrivateRoute>} />
            <Route path="/story-map/:storyId" element={<PrivateRoute><StoryMap /></PrivateRoute>} />
            <Route path="/deck" element={<DeckManager />} />
            <Route path="/write/:storyId" element={<PrivateRoute><WritingWorkspace /></PrivateRoute>} />
            {/* <Route path="/notifications" element={<PrivateRoute><NotificationCenter /></PrivateRoute>} /> */}
            <Route path="/badges" element={<PrivateRoute><BadgeDisplay /></PrivateRoute>} />
            <Route path="/sketch" element={<PrivateRoute><SketchGenerator /></PrivateRoute>} />
            <Route path="/feedback" element={<PrivateRoute><FeedbackForm /></PrivateRoute>} />
            <Route path="/fcm-test" element={<FCMTest />} />
            <Route path="/userpage" element={<UserPage />} />
            
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}
console.log(111111111111111111111111111111111111);

export default App;
