import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCbsxcYOu8yw9jGYXRn74Cr1vZpxSJWlsQ",
  authDomain: "freewriters-df22b.firebaseapp.com",
  projectId: "freewriters-df22b",
  messagingSenderId: "1032894542213",
  appId: "1:1032894542213:web:23485c82f20c1fb06b94ec",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getFCMToken = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    const currentToken = await getToken(messaging, {
      vapidKey:"BHaTStFZLy30_RaVr55AbuZIGUSqF5iV39BFLQbhvKhfHxoBRrPp_JMYfaxV1cplriQWv_FiOAYXevIIPJAxRsw",
    });

    if (!currentToken) {
      throw new Error('No registration token available');
    }

    return currentToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw error;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

