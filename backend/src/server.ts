import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import menuRoutes from './routes/menuRoutes';
import chatRoutes from './routes/chatRoutes';
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Intelligent Bistro API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
