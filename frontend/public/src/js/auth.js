import { authAPI } from './api.js';
import { showToast } from './ui.js';

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const saveAuth = (user, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    saveAuth(response.data.user, response.data.token);
    showToast('Registration successful!', 'success');
    return response;
  } catch (error) {
    showToast(error.message || 'Registration failed', 'error');
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    saveAuth(response.data.user, response.data.token);
    showToast('Login successful!', 'success');
    return response;
  } catch (error) {
    showToast(error.message || 'Login failed', 'error');
    throw error;
  }
};

export const logout = () => {
  clearAuth();
  showToast('Logged out successfully', 'success');
  window.location.reload();
};

export const initAuth = () => {
  if (isAuthenticated()) {
    const user = getCurrentUser();
    document.getElementById('userName').textContent = user.username;
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
  } else {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
  }
};
