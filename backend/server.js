// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import sessionRoutes from './routes/sessions.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
connectDB()
  .then(() => {
    console.log('✅ MongoDB connected');

    // Middleware
    app.use(cors());
    app.use(express.json());

    // API Routes
    app.use('/api/sessions', sessionRoutes);
    app.use('/api/auth', authRoutes);

    // Root Route
    app.get('/', (req, res) => {
      res.send('✅ WellnessHub Backend API Running');
    });

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
