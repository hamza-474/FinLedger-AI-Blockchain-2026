const { callGeminiWithRotation, getKeyStatus } = require('../services/geminiService');
const Transaction = require('../models/Transaction');

// Simple in-memory cache for insights
const insightCache = new Map();

// @desc    Get AI insight
// @route   POST /api/ai/insight
// @access  Private
const getInsight = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Check cache
    const cached = insightCache.get(userId);
    if (cached && Date.now() - cached.timestamp < 60 * 60 * 1000 && !req.query.refresh) {
      return res.status(200).json(cached.data);
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: thirtyDaysAgo }
    });

    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    const summary = {
      income,
      expense,
      balance: income - expense,
      topCategories: categories
    };

    const prompt = `You are a helpful personal finance assistant.
Based on this user's last 30 days: ${JSON.stringify(summary)}.
Give 2-3 short, specific, actionable spending tips.
Be direct and friendly. Max 80 words. Plain text only.`;

    try {
      const { text, keyIndex } = await callGeminiWithRotation(prompt);
      
      const responseData = { insight: text, keyUsed: keyIndex };
      
      // Update cache
      insightCache.set(userId, { data: responseData, timestamp: Date.now() });

      res.status(200).json(responseData);
    } catch (aiError) {
      res.status(503).json({ message: "AI insight temporarily unavailable" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Key Status (dev only)
// @route   GET /api/ai/key-status
// @access  Public (dev only)
const getStatus = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: "Not available in production" });
  }
  res.json(getKeyStatus());
};

module.exports = {
  getInsight,
  getStatus
};
