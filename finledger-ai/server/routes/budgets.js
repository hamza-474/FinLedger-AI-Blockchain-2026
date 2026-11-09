const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget
} = require('../controllers/budgetController');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, createOrUpdateBudget);

router.route('/:id')
  .delete(protect, deleteBudget);

module.exports = router;
