const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const seedDefaultCategories = async (userId) => {
  const defaults = [
    { name: 'Salary', type: 'income', color: '#4ade80', icon: 'briefcase' },
    { name: 'Freelance', type: 'income', color: '#60a5fa', icon: 'laptop' },
    { name: 'Investment', type: 'income', color: '#c084fc', icon: 'trending-up' },
    { name: 'Other Income', type: 'income', color: '#9ca3af', icon: 'plus-circle' },
    { name: 'Food', type: 'expense', color: '#f87171', icon: 'shopping-cart' },
    { name: 'Transport', type: 'expense', color: '#fb923c', icon: 'truck' },
    { name: 'Housing', type: 'expense', color: '#facc15', icon: 'home' },
    { name: 'Health', type: 'expense', color: '#2dd4bf', icon: 'activity' },
    { name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'film' },
    { name: 'Shopping', type: 'expense', color: '#a78bfa', icon: 'shopping-bag' },
    { name: 'Utilities', type: 'expense', color: '#38bdf8', icon: 'zap' },
    { name: 'Other', type: 'expense', color: '#9ca3af', icon: 'more-horizontal' },
  ];
  
  // We actually keep defaults where user is null, so everyone shares them.
  // We only seed them if they don't exist at all globally to avoid duplicates.
  const existingDefaults = await Category.find({ user: null });
  if (existingDefaults.length === 0) {
    const toInsert = defaults.map(d => ({ ...d, user: null }));
    await Category.insertMany(toInsert);
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }
    
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      await seedDefaultCategories(); // ensure defaults exist
      res.status(201).json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          currency: user.currency,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          currency: user.currency,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, currency } = req.body;
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = name || user.name;
      user.currency = currency || user.currency;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        currency: updatedUser.currency,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      res.json({ success: true, message: 'Password updated' });
    } else {
      res.status(401);
      throw new Error('Invalid current password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');
    
    await Transaction.deleteMany({ user: req.user.id });
    await Budget.deleteMany({ user: req.user.id });
    await Category.deleteMany({ user: req.user.id });
    
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount
};
