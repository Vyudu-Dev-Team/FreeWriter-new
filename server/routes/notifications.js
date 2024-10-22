import express from 'express';
import auth from '../middleware/auth.js';
import { getUnreadNotifications, markNotificationAsRead } from '../services/notificationService.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await getUnreadNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    await markNotificationAsRead(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;