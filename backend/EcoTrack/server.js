require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const settingsRoutes = require('./src/routes/settings')

// Import the db object which contains our initialized sequelize instance
const db = require('./src/models');
const sequelize = db.sequelize; 

const twoFactorAuthRoutes = require('./src/routes/twoFactorAuth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Attach models to app for easy access in controllers if needed
app.set('models', db);

// Root Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Ecotrack API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/inventory', require('./src/routes/inventory'));
app.use('/api/forecasts', require('./src/routes/forecasts'));
app.use('/api/alerts', require('./src/routes/alerts'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/2fa', twoFactorAuthRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
});

// Start Server and Authenticate Database
app.listen(PORT, async () => {
  try {
    // Now calling authenticate on the correct instance
    await sequelize.authenticate();
    console.log(' Database connected successfully');
  } catch (error) {
    console.error(' Database connection failed:', error.message);
  }

  console.log('\n Server started successfully!');
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
  console.log(` Database: ${process.env.DB_NAME}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log('\n Ready to accept requests!\n');
});