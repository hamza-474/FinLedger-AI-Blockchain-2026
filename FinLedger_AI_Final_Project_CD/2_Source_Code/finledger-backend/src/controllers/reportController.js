const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const blockchainService = require('../blockchain/blockchainService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const getMonthRange = (monthStr) => {
  const startDate = new Date(`${monthStr}-01T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  return { startDate, endDate };
};

exports.getDashboardData = async (req, res, next) => {
  try {
    const org = req.user.organization;
    const now = new Date();
    const currentMonthStr = now.toISOString().substring(0, 7);
    const { startDate, endDate } = getMonthRange(currentMonthStr);

    const txQuery = req.user.role === 'admin' 
      ? { organization: org, isDeleted: false } 
      : { createdBy: req.user.id, isDeleted: false };

    const thisMonthTransactions = await Transaction.find({
      ...txQuery, date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;
    thisMonthTransactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpenses += t.amount;
    });

    const recentTransactions = await Transaction.find(txQuery)
      .sort({ date: -1 }).limit(5);

    const budgetQuery = req.user.role === 'admin'
      ? { organization: org, month: currentMonthStr }
      : { createdBy: req.user.id, month: currentMonthStr };
    const budgets = await Budget.find(budgetQuery);
    const budgetStatus = budgets.map(b => ({
      category: b.category, limitAmount: b.limitAmount, spentAmount: b.spentAmount,
      percentUsed: b.limitAmount > 0 ? parseFloat(((b.spentAmount / b.limitAmount) * 100).toFixed(2)) : 0,
      status: b.status
    }));

    const blockchainStatus = await blockchainService.verifyIntegrity();

    const trendStartDate = new Date();
    trendStartDate.setMonth(trendStartDate.getMonth() - 5);
    trendStartDate.setDate(1);
    trendStartDate.setHours(0, 0, 0, 0);

    const trendTransactions = await Transaction.find({
      ...txQuery, date: { $gte: trendStartDate }
    });

    const monthlyTrendObj = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toISOString().substring(0, 7);
      monthlyTrendObj[mStr] = { month: mStr, income: 0, expense: 0 };
    }

    trendTransactions.forEach(t => {
      const mStr = new Date(t.date).toISOString().substring(0, 7);
      if (monthlyTrendObj[mStr]) {
        if (t.type === 'income') monthlyTrendObj[mStr].income += t.amount;
        if (t.type === 'expense') monthlyTrendObj[mStr].expense += t.amount;
      }
    });

    return successResponse(res, {
      totalIncome, totalExpenses, balance: totalIncome - totalExpenses,
      budgetStatus, recentTransactions, blockchainStatus: blockchainStatus ? 'valid' : 'tampered',
      monthlyTrend: Object.values(monthlyTrendObj)
    }, 'Dashboard data retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month) return errorResponse(res, 'Please provide month YYYY-MM', 400);

    const org = req.user.organization;
    const { startDate, endDate } = getMonthRange(month);

    const txQuery = req.user.role === 'admin' 
      ? { organization: org, isDeleted: false } 
      : { createdBy: req.user.id, isDeleted: false };

    const transactions = await Transaction.find({
      ...txQuery, date: { $gte: startDate, $lt: endDate }
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeByCategory = {};
    const expensesByCategory = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      } else {
        totalExpenses += t.amount;
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      }
    });

    const budgetQuery = req.user.role === 'admin'
      ? { organization: org, month }
      : { createdBy: req.user.id, month };
    const budgets = await Budget.find(budgetQuery);
    const budgetStatus = budgets.map(b => ({
      category: b.category, limitAmount: b.limitAmount, spentAmount: b.spentAmount, variance: b.limitAmount - b.spentAmount
    }));

    const topExpenses = transactions.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5);

    const formattedExpensesByCategory = Object.keys(expensesByCategory).map(key => ({
      _id: key,
      total: expensesByCategory[key]
    }));

    return successResponse(res, {
      totalIncome, totalExpenses, balance: totalIncome - totalExpenses, incomeByCategory, expensesByCategory: formattedExpensesByCategory,
      budgetStatus, topExpenses, transactionCount: transactions.length
    }, 'Monthly report retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.getYearlyReport = async (req, res, next) => {
  try {
    const { year } = req.query;
    if (!year) return errorResponse(res, 'Please provide year YYYY', 400);

    const org = req.user.organization;
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

    const txQuery = req.user.role === 'admin' 
      ? { organization: org, isDeleted: false } 
      : { createdBy: req.user.id, isDeleted: false };

    const transactions = await Transaction.find({
      ...txQuery, date: { $gte: startDate, $lt: endDate }
    });

    const monthlyBreakdown = {};
    for (let i = 1; i <= 12; i++) {
      const monthStr = `${year}-${String(i).padStart(2, '0')}`;
      monthlyBreakdown[monthStr] = { month: monthStr, income: 0, expenses: 0, balance: 0 };
    }

    transactions.forEach(t => {
      const mStr = new Date(t.date).toISOString().substring(0, 7);
      if (monthlyBreakdown[mStr]) {
        if (t.type === 'income') {
          monthlyBreakdown[mStr].income += t.amount;
          monthlyBreakdown[mStr].balance += t.amount;
        }
        if (t.type === 'expense') {
          monthlyBreakdown[mStr].expenses += t.amount;
          monthlyBreakdown[mStr].balance -= t.amount;
        }
      }
    });

    return successResponse(res, Object.values(monthlyBreakdown), 'Yearly report retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryReport = async (req, res, next) => {
  try {
    const { category, year } = req.query;
    if (!category || !year) return errorResponse(res, 'Please provide category and year', 400);

    const org = req.user.organization;
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

    const txQuery = req.user.role === 'admin' 
      ? { organization: org, isDeleted: false } 
      : { createdBy: req.user.id, isDeleted: false };

    const transactions = await Transaction.find({
      ...txQuery, category, date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    return successResponse(res, transactions, 'Category report retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.exportTransactions = async (req, res, next) => {
  try {
    const { month, type } = req.query;
    const org = req.user.organization;
    const query = req.user.role === 'admin' 
      ? { organization: org, isDeleted: false } 
      : { createdBy: req.user.id, isDeleted: false };

    if (month) {
      const { startDate, endDate } = getMonthRange(month);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (type) query.type = type;

    const transactions = await Transaction.find(query).sort({ date: -1 });
    return successResponse(res, transactions, 'Transactions exported', 200);
  } catch (error) {
    next(error);
  }
};
