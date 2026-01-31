import { initAuth, register, login, logout, isAuthenticated } from './js/auth.js';
import { loadTasks, createTask, updateTask } from './js/tasks.js';
import { initFilters } from './js/filters.js';
import { showLoading, hideLoading, showToast } from './js/ui.js';

const initApp = () => {
  initAuth();

  setupAuthHandlers();

  setupPasswordValidation();

  setupTaskForm();

  setupLogout();

  if (isAuthenticated()) {
    loadTasks();
    initFilters();
  }
};

const checkPasswordRequirements = (password) => {
  const requirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  
  return requirements;
};

const validatePassword = (password) => {
  const requirements = checkPasswordRequirements(password);
  
  if (!requirements.length) {
    return { 
      valid: false, 
      message: 'Password must be at least 6 characters long' 
    };
  }
  
  if (!requirements.uppercase) {
    return { 
      valid: false, 
      message: 'Password must contain at least one uppercase letter (A-Z)' 
    };
  }
  
  if (!requirements.lowercase) {
    return { 
      valid: false, 
      message: 'Password must contain at least one lowercase letter (a-z)' 
    };
  }
  
  if (!requirements.special) {
    return { 
      valid: false, 
      message: 'Password must contain at least one special character (!@#$%^&*)' 
    };
  }
  
  return { valid: true, message: '' };
};

const checkPasswordStrength = (password) => {
  if (password.length === 0) {
    return '';
  }
  
  const requirements = checkPasswordRequirements(password);
  const metCount = Object.values(requirements).filter(Boolean).length;
  
  if (metCount < 2) {
    return 'weak';
  }
  if (metCount < 4) {
    return 'medium';
  }
  return 'strong';
};

const updateRequirementIndicators = (password) => {
  const requirements = checkPasswordRequirements(password);
  
  const reqLength = document.getElementById('reqLength');
  const reqUppercase = document.getElementById('reqUppercase');
  const reqLowercase = document.getElementById('reqLowercase');
  const reqSpecial = document.getElementById('reqSpecial');
  
  if (reqLength) {
    reqLength.classList.toggle('valid', requirements.length);
  }
  if (reqUppercase) {
    reqUppercase.classList.toggle('valid', requirements.uppercase);
  }
  if (reqLowercase) {
    reqLowercase.classList.toggle('valid', requirements.lowercase);
  }
  if (reqSpecial) {
    reqSpecial.classList.toggle('valid', requirements.special);
  }
};

const setupPasswordValidation = () => {
  const passwordInput = document.getElementById('registerPassword');
  const strengthIndicator = document.getElementById('passwordStrength');
  const passwordError = document.getElementById('passwordError');
  const passwordRequirements = document.getElementById('passwordRequirements');
  
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const validation = validatePassword(password);
      
      if (password.length > 0) {
        if (passwordRequirements) {
          passwordRequirements.classList.remove('hidden');
        }
        if (strengthIndicator) {
          strengthIndicator.classList.remove('hidden');
        }
        
        updateRequirementIndicators(password);
        
        if (strengthIndicator) {
          const strength = checkPasswordStrength(password);
          strengthIndicator.className = 'password-strength';
          if (strength) {
            strengthIndicator.classList.add(strength);
          }
        }
        
        if (validation.valid) {
          passwordInput.style.borderColor = '#28a745';
          if (passwordRequirements) {
            passwordRequirements.classList.add('hidden');
          }
          if (strengthIndicator) {
            strengthIndicator.classList.add('hidden');
          }
        } else {
          passwordInput.style.borderColor = '#dc3545';
        }
      } else {
        if (passwordRequirements) {
          passwordRequirements.classList.add('hidden');
        }
        if (strengthIndicator) {
          strengthIndicator.classList.add('hidden');
        }
        passwordInput.style.borderColor = '#e0e0e0';
        updateRequirementIndicators('');
      }
      
      if (passwordError) {
        passwordError.textContent = '';
      }
    });
    
    passwordInput.addEventListener('focus', (e) => {
      const password = e.target.value;
      if (password.length > 0) {
        const validation = validatePassword(password);
        if (!validation.valid) {
          if (passwordRequirements) {
            passwordRequirements.classList.remove('hidden');
          }
          if (strengthIndicator) {
            strengthIndicator.classList.remove('hidden');
          }
        }
      }
    });
    
    passwordInput.addEventListener('blur', (e) => {
      if (e.target.value.length === 0) {
        updateRequirementIndicators('');
        if (strengthIndicator) {
          strengthIndicator.className = 'password-strength';
          strengthIndicator.classList.add('hidden');
        }
        if (passwordRequirements) {
          passwordRequirements.classList.add('hidden');
        }
        passwordInput.style.borderColor = '#e0e0e0';
      }
    });
  }
};

const setupAuthHandlers = () => {
  document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
  });

  document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
  });

  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('registerPassword').value;
    const passwordError = document.getElementById('passwordError');
    const passwordRequirements = document.getElementById('passwordRequirements');
    const strengthIndicator = document.getElementById('passwordStrength');
    const validation = validatePassword(password);
    
    if (!validation.valid) {
      if (passwordRequirements) {
        passwordRequirements.classList.remove('hidden');
        updateRequirementIndicators(password);
      }
      if (strengthIndicator) {
        strengthIndicator.classList.remove('hidden');
        const strength = checkPasswordStrength(password);
        strengthIndicator.className = 'password-strength';
        if (strength) {
          strengthIndicator.classList.add(strength);
        }
      }
      
      if (passwordError) {
        passwordError.textContent = validation.message;
      }
      showToast(validation.message, 'error');
      return;
    }
    
    if (passwordError) {
      passwordError.textContent = '';
    }
    
    showLoading();
    
    try {
      const userData = {
        username: document.getElementById('registerUsername').value.trim(),
        email: document.getElementById('registerEmail').value.trim(),
        password: password
      };
      
      if (!userData.username || userData.username.length < 3) {
        showToast('Username must be at least 3 characters long', 'error');
        hideLoading();
        return;
      }
      
      if (!userData.email) {
        showToast('Please enter a valid email', 'error');
        hideLoading();
        return;
      }
      
      await register(userData);
      initAuth();
      loadTasks();
      initFilters();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      hideLoading();
    }
  });

  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }
    
    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }
    
    showLoading();
    
    try {
      const credentials = {
        email: email,
        password: password
      };
      
      await login(credentials);
      initAuth();
      loadTasks();
      initFilters();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      hideLoading();
    }
  });
};

const setupTaskForm = () => {
  const taskForm = document.getElementById('taskForm');
  const cancelBtn = document.getElementById('cancelBtn');

  taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    try {
      const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value
      };

      const taskId = document.getElementById('taskId').value;
      
      if (taskId) {
        await updateTask(taskId, taskData);
      } else {
        await createTask(taskData);
      }
    } catch (error) {
      console.error('Task operation error:', error);
    } finally {
      hideLoading();
    }
  });

  cancelBtn?.addEventListener('click', () => {
    taskForm.reset();
    document.getElementById('formTitle').textContent = 'Add New Task';
    document.getElementById('submitBtn').textContent = 'Add Task';
    cancelBtn.style.display = 'none';
    document.getElementById('taskId').value = '';
  });
};

const setupLogout = () => {
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
