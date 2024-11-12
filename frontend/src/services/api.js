import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (username, email, password) => api.post('/users/register', { username, email, password })
};

export default api;
