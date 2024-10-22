import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Badge } from '@mui/material';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Notifications</Typography>
      <Badge badgeContent={notifications.length} color="primary">
        <List>
          {notifications.map(notification => (
            <ListItem key={notification._id} button onClick={() => handleNotificationRead(notification._id)}>
              <ListItemText primary={notification.content} secondary={new Date(notification.createdAt).toLocaleString()} />
            </ListItem>
          ))}
        </List>
      </Badge>
    </div>
  );
};

export default NotificationCenter;