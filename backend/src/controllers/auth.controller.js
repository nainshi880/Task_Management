const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../utils/constants');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');


const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return errorResponse(res, 'User already exists', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);

    successResponse(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    }, 'User registered successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = generateToken(user._id);

    successResponse(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    }, 'Login successful');
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    successResponse(res, { user }, 'User retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation
};
