const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get all users in same organization
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ organization: req.user.organization })
      .select('-password')
      .sort({ createdAt: -1 });
    
    return successResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    return errorResponse(res, 'Server Error', 500);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!['admin', 'staff'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    // Check if user is trying to change their own role
    if (req.user.id === req.params.id) {
      return errorResponse(res, 'Cannot change your own role', 400);
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify organization match
    if (user.organization !== req.user.organization) {
      return errorResponse(res, 'Not authorized to update this user', 403);
    }

    user.role = role;
    await user.save();

    return successResponse(res, user, 'User role updated successfully');
  } catch (error) {
    return errorResponse(res, 'Server Error', 500);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is trying to delete their own account
    if (req.user.id === req.params.id) {
      return errorResponse(res, 'Cannot delete your own account', 400);
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify organization match
    if (user.organization !== req.user.organization) {
      return errorResponse(res, 'Not authorized to delete this user', 403);
    }

    // Check if it's the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({
        organization: req.user.organization,
        role: 'admin'
      });
      if (adminCount <= 1) {
        return errorResponse(res, 'Cannot delete the last admin in the organization', 400);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    return successResponse(res, null, 'User removed successfully');
  } catch (error) {
    return errorResponse(res, 'Server Error', 500);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return errorResponse(res, 'Please provide all required fields', 400);
    }

    if (!['admin', 'staff'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    // Create user in the admin's organization
    const user = await User.create({
      name,
      email,
      password,
      role,
      organization: req.user.organization
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    };

    return successResponse(res, userData, 'User created successfully', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server Error', 500);
  }
};
