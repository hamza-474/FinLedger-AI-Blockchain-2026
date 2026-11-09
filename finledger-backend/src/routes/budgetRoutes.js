const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');
const {
  createBudget,
  getAllBudgets,
  updateBudget,
  deleteBudget,
  getBudgetStatus
} = require('../controllers/budgetController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Budget:
 *       type: object
 *       required:
 *         - category
 *         - limitAmount
 *         - month
 *       properties:
 *         category:
 *           type: string
 *           description: Budget category
 *         limitAmount:
 *           type: number
 *           description: Max allowed spending
 *         spentAmount:
 *           type: number
 *           description: Current spent amount (auto-calculated)
 *         month:
 *           type: string
 *           description: Format YYYY-MM
 *         status:
 *           type: string
 *           enum: [within_limit, warning, exceeded]
 *           description: Auto-calculated status
 */

router.use(protect);

/**
 * @swagger
 * /api/budgets/status:
 *   get:
 *     summary: Get all budget statuses with percentage used
 *     tags: [Budgets]
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
 *         description: Budget statuses retrieved
 */
router.get('/status', getBudgetStatus);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Format YYYY-MM
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - limitAmount
 *               - month
 *             properties:
 *               category:
 *                 type: string
 *               limitAmount:
 *                 type: number
 *               month:
 *                 type: string
 *     responses:
 *       201:
 *         description: Budget created
 *       400:
 *         description: Validation error or budget already exists
 */
router.route('/')
  .get(getAllBudgets)
  .post(
    [
      body('category', 'Category is required').not().isEmpty(),
      body('limitAmount', 'Limit amount is required and must be numeric').isNumeric(),
      body('month', 'Month is required (YYYY-MM)').matches(/^\d{4}-\d{2}$/)
    ],
    createBudget
  );

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: Update budget limit amount
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limitAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Budget updated
 *       404:
 *         description: Budget not found
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted
 *       404:
 *         description: Budget not found
 */
router.route('/:id')
  .put(updateBudget)
  .delete(adminOnly, deleteBudget);

module.exports = router;
