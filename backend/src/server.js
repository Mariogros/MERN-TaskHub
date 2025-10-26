require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const taskRoutes = require('./routes/tasks');
const { requestIdMiddleware, metricsMiddleware, getMetrics } = require('./middleware/metrics');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskhub';

// Middleware
app.use(cors());
app.use(express.json());

// Add request ID to all requests
app.use(requestIdMiddleware);

// Track metrics
app.use(metricsMiddleware);

// Custom morgan format with request ID
morgan.token('request-id', (req) => req.id);
app.use(morgan(':request-id :method :url :status :res[content-length] - :response-time ms'));

// Routes
app.use('/api', taskRoutes);

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    message: 'Task Hub API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      metrics: 'GET /metrics',
      tasks: {
        getAll: 'GET /api/tasks',
        search: 'GET /api/tasks?q=search_term',
        create: 'POST /api/tasks',
        delete: 'DELETE /api/tasks/:id'
      }
    },
    documentation: 'See README.md for full documentation'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json(getMetrics());
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
