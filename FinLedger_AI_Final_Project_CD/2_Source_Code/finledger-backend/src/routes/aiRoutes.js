const express = require('express');
const { protect } = require('../middleware/auth');
const {
  predictSpending,
  detectAnomalies,
  generateReport,
  askQuestion
} = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(aiLimiter);
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Google Gemini AI powered financial insights
 */

/**
 * @swagger
 * /api/ai/predict-spending:
 *   get:
 *     summary: Predict next month spending by category
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spending predictions returned as JSON
 */
router.get('/predict-spending', predictSpending);

/**
 * @swagger
 * /api/ai/detect-anomalies:
 *   get:
 *     summary: Detect anomalous or suspicious transactions
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flagged transactions with reasons
 */
router.get('/detect-anomalies', detectAnomalies);

/**
 * @swagger
 * /api/ai/generate-report:
 *   get:
 *     summary: Generate a professional financial analysis report
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI generated financial report
 */
router.get('/generate-report', generateReport);

/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Ask the AI financial advisor a question
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI advice response
 */
router.post('/ask', askQuestion);

module.exports = router;
