const { errorResponse } = require('../utils/responseHelper');

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 'Not authorized to access this route, admin role required', 403);
};
