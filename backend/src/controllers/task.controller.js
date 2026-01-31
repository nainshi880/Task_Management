const { body } = require('express-validator');
const taskService = require('../services/task.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../utils/constants');
const { TASK_STATUS } = require('../utils/constants');

const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage('Invalid status')
];

const getTasks = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search
    };

    const tasks = await taskService.getTasks(req.user._id, filters);
    successResponse(res, { tasks }, 'Tasks retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);

    if (!task) {
      return errorResponse(res, 'Task not found', HTTP_STATUS.NOT_FOUND);
    }

    successResponse(res, { task }, 'Task retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    successResponse(res, { task }, 'Task created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);

    if (!task) {
      return errorResponse(res, 'Task not found', HTTP_STATUS.NOT_FOUND);
    }

    successResponse(res, { task }, 'Task updated successfully');
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user._id);

    if (!task) {
      return errorResponse(res, 'Task not found', HTTP_STATUS.NOT_FOUND);
    }

    successResponse(res, null, 'Task deleted successfully');
  } catch (error) {
    errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  taskValidation
};
