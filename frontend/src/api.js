import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenith_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto logout on login attempt failures
      if (!error.config.url.includes('/api/auth/login')) {
        localStorage.removeItem('zenith_token');
        localStorage.removeItem('zenith_user');
        window.dispatchEvent(new Event('auth-changed'));
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('zenith_token', res.data.access_token);
    localStorage.setItem('zenith_user', JSON.stringify(res.data.user));
    window.dispatchEvent(new Event('auth-changed'));
    return res.data;
  },

  register: async (email, password, full_name) => {
    const res = await api.post('/api/auth/register', { email, password, full_name });
    localStorage.setItem('zenith_token', res.data.access_token);
    localStorage.setItem('zenith_user', JSON.stringify(res.data.user));
    window.dispatchEvent(new Event('auth-changed'));
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('zenith_token');
    localStorage.removeItem('zenith_user');
    window.dispatchEvent(new Event('auth-changed'));
  },

  updateBudget: async (monthly_budget) => {
    const res = await api.put('/api/auth/budget', { monthly_budget: parseFloat(monthly_budget) });
    const existingUser = authService.getUser() || {};
    localStorage.setItem('zenith_user', JSON.stringify({ ...existingUser, ...res.data }));
    window.dispatchEvent(new Event('auth-changed'));
    return res.data;
  },

  getUser: () => {
    try {
      const user = localStorage.getItem('zenith_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('zenith_token');
  }
};

export const expenseService = {
  getExpenses: async (params = {}) => {
    const res = await api.get('/api/expenses', { params });
    return res.data;
  },

  createExpense: async (expenseData) => {
    const res = await api.post('/api/expenses', expenseData);
    return res.data;
  },

  updateExpense: async (id, expenseData) => {
    const res = await api.put(`/api/expenses/${id}`, expenseData);
    return res.data;
  },

  deleteExpense: async (id) => {
    await api.delete(`/api/expenses/${id}`);
  },

  getDashboardSummary: async () => {
    const res = await api.get('/api/analytics/dashboard');
    return res.data;
  },

  getCategoryAnalytics: async () => {
    const res = await api.get('/api/analytics/by-category');
    return res.data;
  }
};

export default api;
