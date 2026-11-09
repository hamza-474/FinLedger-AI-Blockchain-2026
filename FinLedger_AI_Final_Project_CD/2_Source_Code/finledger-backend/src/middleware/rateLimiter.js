const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/responseHelper');

const createRateLimiter = (maxRequests, windowMinutes, message) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    handler: (req, res) => {
      errorResponse(res, message || `Too many requests, please try again in ${windowMinutes} minutes`, 429);
    }
  });
};

const generalLimiter = createRateLimiter(1000, 15);
const authLimiter = createRateLimiter(10, 15, 'Too many login/register attempts, please try again later');
const aiLimiter = createRateLimiter(20, 15, 'AI query limit reached, please try again later');

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter
};
