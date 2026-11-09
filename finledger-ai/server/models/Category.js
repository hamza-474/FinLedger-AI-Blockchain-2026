const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means it's a default category for everyone
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#808080', // hex color
    },
    icon: {
      type: String,
      default: 'folder',
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
