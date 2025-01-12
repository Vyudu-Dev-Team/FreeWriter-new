import React, { useEffect, useState } from 'react';
import { getFCMToken, onMessageListener } from '../firebase/firebase';

const FCMTest = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        console.log('Starting FCM token retrieval...');
        const token = await getFCMToken();
        console.log('FCM token retrieved successfully');
        setFcmToken(token);
      } catch (err) {
        console.error('Error in FCMTest:', err);
        setError(err.message);
      }
    };

    getToken();

    const unsubscribe = onMessageListener().then(payload => {
      setNotification(payload);
    }).catch(err => console.log('failed: ', err));

    return () => {
      unsubscribe.catch(err => console.log('failed to unsubscribe', err));
    };
  }, []);

  return (
    <div>
      <h2>FCM Token Test</h2>
      {fcmToken && <p>FCM Token: {fcmToken}</p>}
      {error && (
        <div>
          <p>Error: {error}</p>
          <p>Please check the console for more detailed error information.</p>
        </div>
      )}
      {notification && (
        <div>
          <h3>Last Notification</h3>
          <p>Title: {notification.notification.title}</p>
          <p>Body: {notification.notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default FCMTest;

