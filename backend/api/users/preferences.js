import { authMiddleware } from '../../middleware/authMiddleware';
import { updatePreferences, getPreferences } from '../../services/preferencesService';

export default authMiddleware(async (req, res) => {
  const { method } = req;
  const userId = req.user.id;

  switch (method) {
    case 'GET':
      try {
        const preferences = await getPreferences(userId);
        res.status(200).json(preferences);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching preferences' });
      }
      break;
    case 'PUT':
      try {
        const { preferences } = req.body;
        await updatePreferences(userId, preferences);
        res.status(200).json({ message: 'Preferences updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Error updating preferences' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});