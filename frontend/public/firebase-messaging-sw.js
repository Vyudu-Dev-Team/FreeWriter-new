importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCbsxcYOu8yw9jGYXRn74Cr1vZpxSJWlsQ",
  authDomain: "freewriters-df22b.firebaseapp.com",
  projectId: "freewriters-df22b",
  messagingSenderId: "1032894542213",
  appId: "1:1032894542213:web:23485c82f20c1fb06b94ec",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener('push', function(event) {
  const payload = event.data.json();
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://your-site-url.com')
  );
});

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

