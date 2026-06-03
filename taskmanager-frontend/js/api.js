//Base config 
const API_BASE = 'http://localhost:8080/api/v1';

//Token helpers 
const getToken  = ()        => localStorage.getItem('token');
const setToken  = (token)   => localStorage.setItem('token', token);
const getUser   = ()        => JSON.parse(localStorage.getItem('user') || 'null');
const setUser   = (user)    => localStorage.setItem('user', JSON.stringify(user));
const clearAuth = ()        => { localStorage.removeItem('token'); localStorage.removeItem('user'); };

//Auth guard — redirect if not logged in 
const requireAuth = () => {
  if (!getToken()) { window.location.href = 'index.html'; }
};

// Admin guard 
const requireAdmin = () => {
  const user = getUser();
  if (!user || user.role !== 'ADMIN') { window.location.href = 'dashboard.html'; }
};

//Core fetch wrapper 
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuth();
    window.location.href = 'index.html';
    return;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Something went wrong';
    throw new Error(message);
  }

  return data;
};

// Auth API
const AuthAPI = {
  register: (payload) => apiFetch('/auth/register', {
    method: 'POST', body: JSON.stringify(payload),
  }),

  login: (payload) => apiFetch('/auth/login', {
    method: 'POST', body: JSON.stringify(payload),
  }),
};

// Tasks API 
const TaskAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/tasks${query ? '?' + query : ''}`);
  },

  create: (payload) => apiFetch('/tasks', {
    method: 'POST', body: JSON.stringify(payload),
  }),

  update: (id, payload) => apiFetch(`/tasks/${id}`, {
    method: 'PUT', body: JSON.stringify(payload),
  }),

  listAll: () => apiFetch('/users/tasks'), // For admin to see all tasks

  delete: async (id) => {
    const token = getToken();
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) {
      clearAuth();
      window.location.href = 'index.html';
      return;
    }
    if (!response.ok) throw new Error('Failed to delete task');
    return response.text();
  },
};

//Users API (Admin only) 
const UserAPI = {
  list: () => apiFetch('/users'),
  delete: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};