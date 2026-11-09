const Transaction = require('../models/Transaction');
const blockchainService = require('../blockchain/blockchainService');
const budgetController = require('./budgetController');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.createTransaction = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation Error', 400, errors.array());
  }

  try {
    const { title, amount, type, category, description, date, receiptUrl, isReimbursement } = req.body;
    const isStaff = req.user.role === 'staff';
    
    // Calculate date for 7 days ago to check for recent duplicates
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Check for duplicate title AND amount within the last 7 days (case-insensitive title)
    const existingTx = await Transaction.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      amount: amount,
      date: { $gte: sevenDaysAgo },
      organization: req.user.organization, 
      isDeleted: false 
    });

    let status = 'approved';
    const LARGE_AMOUNT_THRESHOLD = 50000; // Auto-approve threshold

    if (isStaff) {
      if (existingTx || amount > LARGE_AMOUNT_THRESHOLD) {
        status = 'pending';
      }
    }

    const transactionData = {
      title, amount, type, category, description,
      date: date || new Date(),
      createdBy: req.user.id,
      organization: req.user.organization,
      status,
      isDuplicate: !!existingTx,
      receiptUrl,
      isReimbursement: isReimbursement || false
    };

    let transaction = await Transaction.create(transactionData);

    if (status === 'approved') {
      const blockchainPayload = {
        transactionId: transaction._id,
        title, amount, type, category,
        date: transactionData.date,
        organization: req.user.organization,
        createdBy: req.user.id
      };

      const newBlock = await blockchainService.addTransaction(blockchainPayload);

      transaction.blockIndex = newBlock.index;
      transaction.blockHash = newBlock.hash;
      await transaction.save();

      if (type === 'expense') {
        const transactionMonth = new Date(transactionData.date).toISOString().substring(0, 7);
        await budgetController.updateSpentAmount(category, req.user.organization, transactionMonth, amount, req.user.id);
      }
    }

    return successResponse(res, transaction, status === 'approved' ? 'Transaction created' : 'Transaction submitted for approval', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const { type, category, month } = req.query;
    const query = req.user.role === 'admin'
      ? { organization: req.user.organization, isDeleted: false }
      : { createdBy: req.user.id, isDeleted: false };

    if (type) query.type = type;
    if (category) query.category = category;
    if (month) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    return successResponse(res, transactions, 'Transactions retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id, organization: req.user.organization, isDeleted: false
    });

    if (!transaction) return errorResponse(res, 'Transaction not found', 404);
    return successResponse(res, transaction, 'Transaction retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id, organization: req.user.organization, isDeleted: false
    });

    if (!transaction) return errorResponse(res, 'Transaction not found', 404);

    const { title, description, category, amount, date, type } = req.body;
    if (amount || date || type) {
      return errorResponse(res, 'Cannot update amount, date, or type due to blockchain immutability', 400);
    }

    transaction.title = title || transaction.title;
    transaction.description = description !== undefined ? description : transaction.description;
    transaction.category = category || transaction.category;
    await transaction.save();

    return successResponse(res, transaction, 'Transaction updated', 200);
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id, organization: req.user.organization, isDeleted: false
    });

    if (!transaction) return errorResponse(res, 'Transaction not found', 404);

    transaction.isDeleted = true;
    await transaction.save();

    return successResponse(res, {}, 'Transaction deleted', 200);
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const query = req.user.role === 'admin'
      ? { organization: req.user.organization, isDeleted: false }
      : { createdBy: req.user.id, isDeleted: false };

    if (month) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(query);
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
      const isApproved = !t.status || t.status === 'approved';
      if (isApproved) {
        if (t.type === 'income') totalIncome += t.amount;
        else if (t.type === 'expense') totalExpenses += t.amount;
      }
    });

    return successResponse(res, {
      totalIncome, totalExpenses, balance: totalIncome - totalExpenses, transactionCount: transactions.length
    }, 'Summary retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.approveTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id, organization: req.user.organization, isDeleted: false
    });

    if (!transaction) return errorResponse(res, 'Transaction not found', 404);
    if (transaction.status === 'approved') return errorResponse(res, 'Transaction is already approved', 400);

    const blockchainPayload = {
      transactionId: transaction._id,
      title: transaction.title, 
      amount: transaction.amount, 
      type: transaction.type, 
      category: transaction.category,
      date: transaction.date,
      organization: transaction.organization,
      createdBy: transaction.createdBy
    };

    const newBlock = await blockchainService.addTransaction(blockchainPayload);

    transaction.blockIndex = newBlock.index;
    transaction.blockHash = newBlock.hash;
    transaction.status = 'approved';
    await transaction.save();

    if (transaction.type === 'expense') {
      const transactionMonth = new Date(transaction.date).toISOString().substring(0, 7);
      await budgetController.updateSpentAmount(transaction.category, req.user.organization, transactionMonth, transaction.amount, req.user.id);
    }

    return successResponse(res, transaction, 'Transaction approved and added to blockchain', 200);
  } catch (error) {
    next(error);
  }
};

exports.rejectTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id, organization: req.user.organization, isDeleted: false
    });

    if (!transaction) return errorResponse(res, 'Transaction not found', 404);
    if (transaction.status === 'approved') return errorResponse(res, 'Cannot reject an already approved transaction', 400);

    transaction.status = 'rejected';
    await transaction.save();

    return successResponse(res, transaction, 'Transaction rejected', 200);
  } catch (error) {
    next(error);
  }
};
