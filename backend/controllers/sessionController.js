// controllers/sessionController.js
import Session from '../models/Session.js';

export const getPublishedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error getting published sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSession = async (req, res) => {
  const { id, title, tags, json_file_url, userId, status } = req.body;

  if (!title || !json_file_url || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let session;

    if (id) {
      session = await Session.findByIdAndUpdate(
        id,
        { title, tags, json_file_url, status: status || 'draft' },
        { new: true }
      );
    } else {
      session = new Session({
        title,
        tags,
        json_file_url,
        userId,
        status: status || 'draft'
      });
      await session.save();
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const publishSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = 'published';
    const updated = await session.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error publishing session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    await session.deleteOne();
    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
