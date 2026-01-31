const { errorResponse } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, messages.join(', '), HTTP_STATUS.BAD_REQUEST);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, HTTP_STATUS.BAD_REQUEST);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid ID format', HTTP_STATUS.BAD_REQUEST);
  }

  return errorResponse(
    res,
    err.message || 'Internal server error',
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

module.exports = { errorHandler };
