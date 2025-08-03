import express from 'express';
import Session from '../models/session.js';

const router = express.Router();

router.get('/published', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching published sessions:', err);
    res.status(500).json({ error: 'Failed to fetch published sessions' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching user sessions:', err);
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

router.post('/create', async (req, res) => {
  const { id, userId, title, tags, json_file_url, status } = req.body;

  if (!userId || !title || !json_file_url) {
    return res.status(400).json({ error: 'Missing required fields: userId, title, or json_file_url' });
  }

  try {
    let session;

    if (id) {
      session = await Session.findByIdAndUpdate(
        id,
        { title, tags, json_file_url, status, userId },
        { new: true }
      );
    } else {
      session = new Session({ title, tags, json_file_url, status, userId });
      await session.save();
    }

    res.status(200).json(session);
  } catch (err) {
    console.error('Session create/update error:', err);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
