const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Authentication required', HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', HTTP_STATUS.UNAUTHORIZED);
  }
};

module.exports = { authenticate };
