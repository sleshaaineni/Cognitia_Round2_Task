require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Don't connect to MongoDB here - connect per request in serverless

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
const devOrigin = 'http://localhost:5173';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header) and any explicitly configured frontend origin.
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production' && origin === devOrigin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Body parser
app.use(express.json({ limit: '100kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/chat', chatRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
