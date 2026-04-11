import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
  createItem: (payload) => api.post('/items', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateItem: (id, payload) => api.put(`/items/${id}`, payload),
  deleteItem: (id) => api.delete(`/items/${id}`),
};
