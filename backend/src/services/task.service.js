const Task = require('../models/Task');
const { TASK_STATUS } = require('../utils/constants');

const getTasks = async (userId, filters = {}) => {
  const query = { user: userId };

  if (filters.status && Object.values(TASK_STATUS).includes(filters.status)) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return tasks;
};

const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  return task;
};

const createTask = async (taskData, userId) => {
  const task = await Task.create({
    ...taskData,
    user: userId
  });
  return task;
};

const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );
  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  return task;
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
