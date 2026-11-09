const Category = require('../models/Category');

// @desc    Get all categories (defaults + user custom)
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      $or: [{ user: null }, { user: req.user.id }]
    });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create custom category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon, type } = req.body;

    if (!name || !type) {
      res.status(400);
      throw new Error('Please provide name and type');
    }

    const category = await Category.create({
      user: req.user.id,
      name,
      color,
      icon,
      type
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Only allow deleting user's custom categories
    if (category.user === null || category.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete this category');
    }

    await category.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};
