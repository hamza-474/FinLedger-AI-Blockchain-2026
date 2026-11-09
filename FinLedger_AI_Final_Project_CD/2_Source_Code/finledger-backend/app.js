const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const connectDB = require('./src/config/db');
const { logRequest } = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');
const { generalLimiter } = require('./src/middleware/rateLimiter');
const swaggerSpec = require('./swagger/swagger');

// Initialize express app
const app = express();

// Connect to MongoDB (only if not running tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const blockchainService = require('./src/blockchain/blockchainService');
    blockchainService.loadChainFromDB();
  });
}

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(logRequest);

// Apply rate limiting to all api routes
app.use('/api', generalLimiter);

// Swagger setup (OpenAPI 3.0)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FinLedger AI Server is running healthy' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/blockchain', require('./src/routes/blockchainRoutes'));
app.use('/api/transactions', require('./src/routes/transactionRoutes'));
app.use('/api/budgets', require('./src/routes/budgetRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));

// Global error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
