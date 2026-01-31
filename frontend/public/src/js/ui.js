export const showToast = (message, type = 'success') => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
};

export const showLoading = () => {
  document.getElementById('loadingOverlay').classList.remove('hidden');
};

export const hideLoading = () => {
  document.getElementById('loadingOverlay').classList.add('hidden');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status) => {
  return status.replace('_', '-');
};

export const renderTasks = (tasks) => {
  const container = document.getElementById('tasksContainer');
  
  if (!tasks || tasks.length === 0) {
    container.innerHTML = '<p class="empty-message">No tasks found. Create your first task!</p>';
    return;
  }

  container.innerHTML = tasks.map(task => `
    <div class="task-card ${task.status === 'completed' ? 'completed' : ''}">
      <div class="task-header">
        <div>
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          <span class="task-status ${getStatusClass(task.status)}">${task.status.replace('_', ' ')}</span>
        </div>
      </div>
      ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
      <div class="task-date">Created: ${formatDate(task.createdAt)}</div>
      <div class="task-actions">
        <button class="btn btn-primary btn-icon" onclick="window.editTask('${task._id}')" title="Edit task">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn btn-danger btn-icon" onclick="window.deleteTask('${task._id}')" title="Delete task">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

window.editTask = async (id) => {
  const { editTask } = await import('./tasks.js');
  editTask(id);
};

window.deleteTask = async (id) => {
  try {
    const { deleteTask } = await import('./tasks.js');
    await deleteTask(id);
  } catch (error) {
    console.error('Error in deleteTask:', error);
  }
};
