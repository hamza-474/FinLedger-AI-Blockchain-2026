const Transaction = require('../models/Transaction');
const fs = require('fs');
const Papa = require('papaparse');
const { stringify } = require('csv-stringify/sync');

// @desc    Get transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, search, page = 1, limit = 20 } = req.query;
    
    let query = { user: req.user.id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.note = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, date, note, isRecurring } = req.body;

    if (!type || !amount || !category || !date) {
      res.status(400);
      throw new Error('Please provide type, amount, category, and date');
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      date,
      note,
      isRecurring,
      currency: req.user.currency,
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    // Check for user
    if (transaction.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    // Check for user
    if (transaction.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary for dashboard
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const currentMonth = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const currentYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const startOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1);
    const startOfNextMonth = new Date(currentYear, currentMonth, 1);
    const startOfLastMonth = new Date(currentYear, currentMonth - 2, 1);

    // Current month transactions
    const currentTransactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
    });

    // Last month transactions
    const lastTransactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const sumAmounts = (txs, type) => txs.filter(t => t.type === type).reduce((acc, t) => acc + t.amount, 0);

    const currIncome = sumAmounts(currentTransactions, 'income');
    const currExpense = sumAmounts(currentTransactions, 'expense');
    const lastIncome = sumAmounts(lastTransactions, 'income');
    const lastExpense = sumAmounts(lastTransactions, 'expense');

    const balance = currIncome - currExpense;

    const calcChange = (curr, last) => {
      if (last === 0) return curr > 0 ? 100 : 0;
      return ((curr - last) / last) * 100;
    };

    // Category breakdown
    const categoryBreakdownMap = {};
    currentTransactions.forEach(t => {
      if (!categoryBreakdownMap[t.category]) {
        categoryBreakdownMap[t.category] = { category: t.category, total: 0, type: t.type };
      }
      categoryBreakdownMap[t.category].total += t.amount;
    });

    // Recent 5 transactions
    const recentTransactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5);

    // Get 6 months chart data
    const last6Months = [];
    for(let i=5; i>=0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      last6Months.push({ month: m, year: y, monthName: d.toLocaleString('default', { month: 'short' }), income: 0, expense: 0 });
    }
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    
    const chartTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: sixMonthsAgo }
    });
    
    chartTxs.forEach(t => {
      const tMonth = t.date.getMonth() + 1;
      const tYear = t.date.getFullYear();
      const monthData = last6Months.find(m => m.month === tMonth && m.year === tYear);
      if (monthData) {
        if (t.type === 'income') monthData.income += t.amount;
        else monthData.expense += t.amount;
      }
    });

    res.status(200).json({
      totalIncome: currIncome,
      totalExpenses: currExpense,
      balance,
      monthOverMonthChange: {
        income: calcChange(currIncome, lastIncome),
        expenses: calcChange(currExpense, lastExpense),
      },
      categoryBreakdown: Object.values(categoryBreakdownMap),
      recentTransactions,
      chartData: last6Months
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import transactions from CSV
// @route   POST /api/transactions/import
// @access  Private
const importCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a CSV file');
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const validTransactions = [];
        const errors = [];

        rows.forEach((row, index) => {
          if (!row.date || !row.type || !row.amount || !row.category) {
            errors.push(`Row ${index + 1}: Missing required fields`);
            return;
          }
          if (row.type !== 'income' && row.type !== 'expense') {
            errors.push(`Row ${index + 1}: Type must be 'income' or 'expense'`);
            return;
          }
          
          validTransactions.push({
            user: req.user.id,
            date: new Date(row.date),
            type: row.type,
            amount: parseFloat(row.amount),
            category: row.category,
            note: row.note || '',
            currency: req.user.currency,
          });
        });

        if (validTransactions.length > 0) {
          await Transaction.insertMany(validTransactions);
        }

        // Cleanup temp file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
          imported: validTransactions.length,
          errors,
        });
      },
      error: (err) => {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, message: 'Failed to parse CSV' });
      }
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(error);
  }
};

// @desc    Export transactions to CSV
// @route   GET /api/transactions/export
// @access  Private
const exportCSV = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    
    const records = transactions.map(t => ({
      date: t.date.toISOString().split('T')[0],
      type: t.type,
      amount: t.amount,
      category: t.category,
      note: t.note
    }));
    
    const csvString = stringify(records, { header: true });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  importCSV,
  exportCSV
};
