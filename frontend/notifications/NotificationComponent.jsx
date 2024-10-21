// frontend/notifications/NotificationComponent.jsx
import React, { useState } from 'react';

const NotificationComponent = () => {
  const [notifications] = useState([
    { id: 1, message: 'Welcome to FreeWriter!' },
    { id: 3, message: 'New story added to your deck.' },
  ]);

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
