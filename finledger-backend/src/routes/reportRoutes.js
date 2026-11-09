const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getDashboardData,
  getMonthlyReport,
  getYearlyReport,
  getCategoryReport,
  exportTransactions
} = require('../controllers/reportController');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Financial reports and dashboard metrics
 */

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get main dashboard data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data including trends, budget status, and recent transactions
 */
router.get('/dashboard', getDashboardData);

/**
 * @swagger
 * /api/reports/monthly:
 *   get:
 *     summary: Get comprehensive monthly report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Format YYYY-MM
 *     responses:
 *       200:
 *         description: Monthly breakdown
 */
router.get('/monthly', getMonthlyReport);

/**
 * @swagger
 * /api/reports/yearly:
 *   get:
 *     summary: Get yearly trend report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Format YYYY
 *     responses:
 *       200:
 *         description: Month-by-month breakdown
 */
router.get('/yearly', getYearlyReport);

/**
 * @swagger
 * /api/reports/category:
 *   get:
 *     summary: Get report for a specific category
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category transactions
 */
router.get('/category', getCategoryReport);

/**
 * @swagger
 * /api/reports/export:
 *   get:
 *     summary: Export filtered transactions
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *     responses:
 *       200:
 *         description: Array of transactions for export
 */
router.get('/export', exportTransactions);

module.exports = router;
