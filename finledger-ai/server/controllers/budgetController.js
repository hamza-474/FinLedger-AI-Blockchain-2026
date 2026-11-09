const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get budgets for month/year
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budgets = await Budget.find({ user: req.user.id, month, year }).lean();

    // Calculate spent amount for each budget
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lt: endOfMonth },
      type: 'expense'
    });

    const budgetsWithSpent = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });

    res.status(200).json(budgetsWithSpent);
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
const createOrUpdateBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      res.status(400);
      throw new Error('Please provide category, amount, month, and year');
    }

    let budget = await Budget.findOne({ user: req.user.id, category, month, year });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        category,
        amount,
        month,
        year
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    if (budget.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await budget.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget
};
