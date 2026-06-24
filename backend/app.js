const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Load env variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Expose public API Documentation
const { renderDocs } = require('./controllers/docsController');
app.get('/api-docs', renderDocs);

// Serve static assets and SPA fallback in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../qaems/dist')));
  
  // SPA Fallback: serve index.html for any non-API routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/api-docs')) {
      return next();
    }
    res.sendFile(path.join(__dirname, '../qaems/dist/index.html'));
  });
} else {
  // API root message in development mode
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: "Glory Simon Interiors QAEMS Backend API is running in Development Mode.",
      documentationUrl: `${req.protocol}://${req.get('host')}/api-docs`,
      version: "v1.0.0"
    });
  });
}

// Routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const siteVisitRoutes = require('./routes/siteVisitRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/site-visits', siteVisitRoutes);
app.use('/api/v1/quotations', quotationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Fallback Route for Undefined Enpoints
app.use((req, res, next) => {
  const error = new Error(`Resource ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
