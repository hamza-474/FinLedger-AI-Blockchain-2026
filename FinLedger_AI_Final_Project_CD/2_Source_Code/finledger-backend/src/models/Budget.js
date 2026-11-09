const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  limitAmount: {
    type: Number,
    required: [true, 'Please add a limit amount']
  },
  spentAmount: {
    type: Number,
    default: 0
  },
  month: {
    type: String,
    required: [true, 'Please add a month in YYYY-MM format']
  },
  organization: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['within_limit', 'warning', 'exceeded'],
    default: 'within_limit'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate status before saving
budgetSchema.pre('save', function(next) {
  if (this.spentAmount > this.limitAmount) {
    this.status = 'exceeded';
  } else if (this.spentAmount >= 0.8 * this.limitAmount) {
    this.status = 'warning';
  } else {
    this.status = 'within_limit';
  }
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);
