const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const vouchersRoutes = require('./modules/vouchers/vouchers.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// 1. Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// 2. CORS configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all during development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 3. Body Parsers (increased limit to handle base64 signature strings cleanly)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static File Serving for Uploaded Signatures
const uploadsPath = path.resolve(__dirname, '../', config.uploadDir);
app.use('/uploads', express.static(uploadsPath));

// 5. API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Expense Voucher Management System API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vouchers', vouchersRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 6. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// 7. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
