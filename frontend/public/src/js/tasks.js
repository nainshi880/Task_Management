import { tasksAPI } from './api.js';
import { showToast, showLoading, hideLoading } from './ui.js';
import { renderTasks } from './ui.js';

let currentFilter = 'all';
let currentSearch = '';

export const loadTasks = async (filters = {}) => {
  try {
    const params = {};
    if (currentFilter !== 'all') {
      params.status = currentFilter;
    }
    if (currentSearch) {
      params.search = currentSearch;
    }

    const response = await tasksAPI.getAll(params);
    renderTasks(response.data.tasks);
  } catch (error) {
    showToast(error.message || 'Failed to load tasks', 'error');
  }
};

export const createTask = async (taskData) => {
  try {
    await tasksAPI.create(taskData);
    showToast('Task created successfully!', 'success');
    document.getElementById('taskForm').reset();
    loadTasks();
  } catch (error) {
    showToast(error.message || 'Failed to create task', 'error');
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    await tasksAPI.update(id, taskData);
    showToast('Task updated successfully!', 'success');
    document.getElementById('taskForm').reset();
    document.getElementById('formTitle').textContent = 'Add New Task';
    document.getElementById('submitBtn').textContent = 'Add Task';
    document.getElementById('cancelBtn').style.display = 'none';
    document.getElementById('taskId').value = '';
    loadTasks();
  } catch (error) {
    showToast(error.message || 'Failed to update task', 'error');
    throw error;
  }
};

export const deleteTask = async (id) => {
  showLoading();
  
  try {
    await tasksAPI.delete(id);
    showToast('Task deleted successfully!', 'success');
    await loadTasks();
  } catch (error) {
    console.error('Delete error:', error);
    showToast(error.message || 'Failed to delete task', 'error');
  } finally {
    hideLoading();
  }
};

export const editTask = async (id) => {
  try {
    const response = await tasksAPI.getById(id);
    const task = response.data.task;

    document.getElementById('taskId').value = task._id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('formTitle').textContent = 'Edit Task';
    document.getElementById('submitBtn').textContent = 'Update Task';
    document.getElementById('cancelBtn').style.display = 'inline-block';

    document.querySelector('.task-form-section').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showToast(error.message || 'Failed to load task', 'error');
  }
};

export const setFilter = (status) => {
  currentFilter = status;
  loadTasks();
};

export const setSearch = (search) => {
  currentSearch = search;
  loadTasks();
};

export const getCurrentFilter = () => currentFilter;
