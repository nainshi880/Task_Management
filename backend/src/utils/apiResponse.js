const { HTTP_STATUS } = require('./constants');

const successResponse = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse
};
