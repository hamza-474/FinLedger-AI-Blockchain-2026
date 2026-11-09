const aiService = require('../ai/aiService');
const Transaction = require('../models/Transaction');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const getTransactionContext = async (organization) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return await Transaction.find({
    organization, isDeleted: false, date: { $gte: threeMonthsAgo }
  }).select('title amount type category date -_id');
};

exports.predictSpending = async (req, res, next) => {
  try {
    const data = await getTransactionContext(req.user.organization);
    const predictions = await aiService.predictFutureSpending(data);
    return successResponse(res, predictions, 'Predictions retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.detectAnomalies = async (req, res, next) => {
  try {
    const data = await getTransactionContext(req.user.organization);
    const analysis = await aiService.detectAnomalies(data);
    return successResponse(res, analysis, 'Anomalies retrieved', 200);
  } catch (error) {
    next(error);
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const transactions = await getTransactionContext(req.user.organization);
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown = {};

    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else {
        totalExpenses += t.amount;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      }
    });

    const summary = { totalIncome, totalExpenses, balance: totalIncome - totalExpenses, categoryBreakdown };
    const report = await aiService.generateFinancialReport(summary);
    return successResponse(res, { report }, 'Financial report generated', 200);
  } catch (error) {
    next(error);
  }
};

exports.askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return errorResponse(res, 'Please provide a question', 400);

    const context = await getTransactionContext(req.user.organization);
    const advice = await aiService.getChatAdvice(question, context);
    return successResponse(res, { answer: advice }, 'AI advice retrieved', 200);
  } catch (error) {
    next(error);
  }
};
