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
import Register from './components/commonComponents/Register';
import EmailVerification from './components/EmailVerification';
import FCMTest from './components/FCMTest';
import DevNavigation from './components/DevNavigation';

import Home from './components/Home';

import BadgeDisplay from './components/BadgeDisplay';
import Dashboard from './components/Dashboard';
import StoryMapComponent from './components/story-mapping/StoryMapComponent';
import StoryMap from './components/story-mapping/StoryMap';
import DeckManager from './components/DeckManager';
import PromptPage from './components/PromptPage';

// Writing Environment Components
import WritingWorkspace from './components/writing-environment/WritingWorkspace';
import TextEditor from './components/writing-environment/TextEditor';
import WritingAnalytics from './components/writing-environment/WritingAnalytics';
import WritingPrompts from './components/writing-environment/WritingPrompts';
import SketchGenerator from './components/writing-environment/SketchGenerator';
import AIAssistant from './components/writing-environment/AIAssistant';

import FeedbackForm from './components/FeedbackForm';

import { AppProvider } from './contexts/AppContext';
import ProfilePage from './components/profileSetup';

import VirgilIntro from './components/A1_initialScreens/VigilIntro';
import Introduction from './components/A1_initialScreens/Introduction';
import UserPage from './components/UserPage';

import MyStoryWorkspace from './components/writing-environment/MyStoryWorkspace';
import VirgilChat from './components/writing-environment/VirgilChat';

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme} sx={{ pb: 2 }}>
        <CssBaseline />
        <Router>
          {/* <Navbar /> */}
          <Routes>
            {/* Dev Navigation */}
            <Route path="/dev" element={<DevNavigation />} />

            {/* INTRODUCTION */}
            <Route path="/" element={<Introduction />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/virgil-intro" element={<VirgilIntro />} />

            {/* Authentication */}
            <Route path="/home" element={<Home />} />
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Setup */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/userpage" element={<UserPage />} />

            {/* Main Features */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prompt" element={<PromptPage />} />
            <Route path="/story-map" element={<StoryMapComponent />} />
            <Route path="/story-map/:storyId" element={<StoryMap />} />
            <Route path="/deck" element={<DeckManager />} />
            <Route path="/virgil-chat" element={<VirgilChat />} />
            <Route path="/my-story" element={<VirgilChat />} />

            {/* Writing Environment */}
            <Route path="/write/" element={<WritingWorkspace />} />
            <Route path="/text-editor" element={<TextEditor />} />
            <Route path="/writing-analytics" element={<WritingAnalytics />} />
            <Route path="/writing-prompts" element={<WritingPrompts />} />
            <Route path="/sketch" element={<SketchGenerator />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />

            {/* My Story Workspace */}
            <Route path="/my-story" element={<MyStoryWorkspace />} />

            {/* Other Features */}
            <Route path="/badges" element={<BadgeDisplay />} />
            
            {/* Utilities */}
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/fcm-test" element={<FCMTest />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
