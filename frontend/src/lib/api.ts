import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.patch('/users/profile', data),
};

// AI Models API
export const aiModelsAPI = {
  getAll: () => api.get('/ai-models'),
  getActive: () => api.get('/ai-models/active'),
  getOne: (id: string) => api.get(`/ai-models/${id}`),
};

// Conversations API
export const conversationsAPI = {
  create: (data: { title?: string; modelId?: string }) =>
    api.post('/conversations', data),
  getAll: () => api.get('/conversations'),
  getOne: (id: string) => api.get(`/conversations/${id}`),
  update: (id: string, data: { title?: string; modelId?: string }) =>
    api.patch(`/conversations/${id}`, data),
  delete: (id: string) => api.delete(`/conversations/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (data: {
    conversationId: string;
    content: string;
    modelId?: string;
  }) => api.post('/chat/send', data),
};

// Admin API
export const adminAPI = {
  // Users
  getAllUsers: () => api.get('/admin/users'),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Models
  getAllModels: () => api.get('/admin/models'),
  createModel: (data: any) => api.post('/admin/models', data),
  updateModel: (id: string, data: any) => api.put(`/admin/models/${id}`, data),
  deleteModel: (id: string) => api.delete(`/admin/models/${id}`),

  // Logs
  getUsageLogs: (page = 1, limit = 50) =>
    api.get(`/admin/usage-logs?page=${page}&limit=${limit}`),
  getStats: () => api.get('/admin/stats'),
};

// Usage Logs API
export const usageLogsAPI = {
  getUserLogs: (page = 1, limit = 50) =>
    api.get(`/usage-logs?page=${page}&limit=${limit}`),
};
