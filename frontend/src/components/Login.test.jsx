import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';

const Login = () => {
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Check if there's a message passed in the location.state
    if (location.state && location.state.message) {
      setAlertMessage({
        type: location.state.type, // e.g., 'success' or 'error'
        text: location.state.message, // Message text
      });

      // Clear the state to prevent showing the message again on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div>
      {/* Display the alert message if present */}
      {alertMessage && (
        <Alert
          severity={alertMessage.type === 'success' ? 'success' : 'error'}
          onClose={() => setAlertMessage(null)}
        >
          {alertMessage.text}
        </Alert>
      )}
      {/* Rest of the login form */}
      <form>
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
