const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
  approveTransaction,
  rejectTransaction
} = require('../controllers/transactionController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - title
 *         - amount
 *         - type
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: Transaction title
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Type of transaction
 *         category:
 *           type: string
 *           description: Transaction category
 *         description:
 *           type: string
 *           description: Additional details
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of transaction
 *         blockIndex:
 *           type: number
 *           description: Blockchain block index
 *         blockHash:
 *           type: string
 *           description: Blockchain block hash
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.use(protect);

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Get transaction summary
 *     tags: [Transactions]
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
 *         description: Summary retrieved successfully
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Format YYYY-MM
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created and added to blockchain
 *       400:
 *         description: Validation error
 */
router.route('/')
  .get(getAllTransactions)
  .post(
    [
      body('title', 'Title is required').not().isEmpty(),
      body('amount', 'Amount is required and must be numeric').isNumeric(),
      body('type', 'Type must be income or expense').isIn(['income', 'expense']),
      body('category', 'Category is required').not().isEmpty()
    ],
    createTransaction
  );

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
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
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 *   put:
 *     summary: Update a transaction (partial)
 *     tags: [Transactions]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *       400:
 *         description: Attempted to modify immutable fields
 *       404:
 *         description: Transaction not found
 *   delete:
 *     summary: Delete a transaction (admin only)
 *     tags: [Transactions]
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
 *         description: Transaction deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Transaction not found
 */
router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(adminOnly, deleteTransaction);

router.put('/:id/approve', adminOnly, approveTransaction);
router.put('/:id/reject', adminOnly, rejectTransaction);

module.exports = router;
