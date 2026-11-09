const Budget = require('../models/Budget');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.createBudget = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation Error', 400, errors.array());
  }

  try {
    const { category, limitAmount, month } = req.body;
    
    const query = req.user.role === 'admin'
      ? { category, month, organization: req.user.organization }
      : { category, month, createdBy: req.user.id };
      
    let budget = await Budget.findOne(query);

    if (budget) {
      return errorResponse(res, 'Budget already exists for this category and month', 400);
    }

    budget = await Budget.create({
      category, limitAmount, month,
      organization: req.user.organization,
      createdBy: req.user.id
    });

    return successResponse(res, budget, 'Budget created', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;
    const query = req.user.role === 'admin'
      ? { organization: req.user.organization }
      : { createdBy: req.user.id };
    if (month) query.month = month;

    const budgets = await Budget.find(query).sort({ month: -1, category: 1 });
    return successResponse(res, budgets, 'Budgets retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }

    if (req.body.limitAmount) {
      budget.limitAmount = req.body.limitAmount;
      await budget.save();
    }
    return successResponse(res, budget, 'Budget updated', 200);
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }

    await budget.deleteOne();
    return successResponse(res, {}, 'Budget deleted', 200);
  } catch (error) {
    next(error);
  }
};

exports.getBudgetStatus = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month) {
      return errorResponse(res, 'Please provide a month in YYYY-MM format', 400);
    }

    const query = req.user.role === 'admin'
      ? { organization: req.user.organization, month }
      : { createdBy: req.user.id, month };
      
    const budgets = await Budget.find(query);
    const statusList = budgets.map(b => {
      let percentUsed = 0;
      if (b.limitAmount > 0) percentUsed = ((b.spentAmount / b.limitAmount) * 100).toFixed(2);
      return {
        _id: b._id, category: b.category, limitAmount: b.limitAmount,
        spentAmount: b.spentAmount, percentUsed: parseFloat(percentUsed), status: b.status
      };
    });

    return successResponse(res, statusList, 'Budget statuses retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.updateSpentAmount = async (category, organization, month, amount, userId) => {
  try {
    const budgets = await Budget.find({ category, organization, month });
    const User = require('../models/User');

    for (const budget of budgets) {
      let shouldUpdate = false;
      
      if (budget.createdBy.toString() === userId?.toString()) {
        shouldUpdate = true; // User's personal budget
      } else {
        const creator = await User.findById(budget.createdBy);
        if (creator && creator.role === 'admin') {
          shouldUpdate = true; // Admin org-wide budget
        }
      }

      if (shouldUpdate) {
        budget.spentAmount += amount;
        await budget.save();
      }
    }
  } catch (error) {
    console.error('Error updating budget spent amount:', error);
  }
};
