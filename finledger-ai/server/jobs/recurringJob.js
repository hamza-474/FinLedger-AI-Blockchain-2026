const Transaction = require('../models/Transaction');

const runRecurringJob = async () => {
  try {
    console.log('Running recurring transactions job...');
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Find all recurring transactions from the past
    // We'll just look at ones that are older than 28 days
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
    
    const recurringTxs = await Transaction.find({
      isRecurring: true,
      date: { $lt: twentyEightDaysAgo }
    });

    let count = 0;

    for (let tx of recurringTxs) {
      // Check if a transaction with the same amount, category, type, and user 
      // exists in the current month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      const exists = await Transaction.findOne({
        user: tx.user,
        type: tx.type,
        category: tx.category,
        amount: tx.amount,
        isRecurring: true,
        date: { $gte: startOfMonth }
      });

      if (!exists) {
        await Transaction.create({
          user: tx.user,
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          note: tx.note + ' (Auto-generated)',
          isRecurring: true,
          date: new Date(),
          currency: tx.currency
        });
        count++;
      }
    }
    
    console.log(`Auto-created ${count} recurring transactions.`);
  } catch (error) {
    console.error('Error in recurring job:', error);
  }
};

// Run once on startup
runRecurringJob();

// Then run every 24 hours
setInterval(runRecurringJob, 24 * 60 * 60 * 1000);

module.exports = runRecurringJob;
