import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatAPI = {
  getHistory: (limit = 10) => api.get(`/chat/history?limit=${limit}`),
  sendMessage: (message: string) => api.post('/chat/send', { message }),
  clearHistory: () => api.delete('/chat/clear'),
};

export const notesAPI = {
  getAll: () => api.get('/notes'),
  create: (note: any) => api.post('/notes', note),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

export const emotionsAPI = {
  getAll: () => api.get('/emotions'),
  getCalendar: () => api.get('/calendar/emotions'),
};

export const psychologistsAPI = {
  getAll: () => api.get('/psychologists'),
  create: (psychologist: any) => api.post('/psychologists', psychologist),
  delete: (id: string) => api.delete(`/psychologists/${id}`),
};

export const tipsAPI = {
  getAll: () => api.get('/tips'),
};

export default api;
