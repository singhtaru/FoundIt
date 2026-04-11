import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: configuredBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (payload) => api.post('/auth/signup', payload),
  signin: (payload) => api.post('/auth/signin', payload),
};

export const itemsApi = {
  getItems: (params) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (payload) => api.post('/items', payload),
  createClaimRequest: (id, payload) => api.post(`/items/${id}/claims`, payload),
  deleteMyClaimRequest: (id) => api.delete(`/items/${id}/claims/me`),
  updateItem: (id, payload) => api.put(`/items/${id}`, payload),
  deleteItem: (id) => api.delete(`/items/${id}`),
};
