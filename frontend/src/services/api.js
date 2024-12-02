import axios from "axios";

const baseURL = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions/api'
  : '/.netlify/functions/api';
// const baseURL ='https://freewriter-develop-branch.netlify.app/.netlify/functions/api';
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    return request;
  },
  (error) => {
    console.log("Request Error", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.log("Response Error", error);
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const userAPI = {
  getCurrentUser: () => api.get("/users/current-user"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  login: (email, password) => api.post("/users/login", { email, password }),
  register: (username, email, password, writingMode) =>
    api.post("/users/register", { username, email, password, writingMode }),
  verifyEmail: (token) => api.post("/users/verify-email", { token }),
  forgotPassword: (email) => api.post("/users/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/users/reset-password", { token, newPassword }),
  resendVerification: (email) =>
    api.post("/users/resend-verification", { email }),
  getPreferences: () => api.get("/users/preferences"),
  updatePreferences: (preferences) =>
    api.put("/users/preferences", preferences),
  resetPreferences: () => api.post("/users/reset-preferences"),
};

export const storyAPI = {
  // Add methods for story-related API calls
  // Example:
  // createStory: (storyData) => api.post('/stories', storyData),
  // getStories: () => api.get('/stories'),
  // updateStory: (storyId, storyData) => api.put(`/stories/${storyId}`, storyData),
  // deleteStory: (storyId) => api.delete(`/stories/${storyId}`),
};
export const deckAPI = {
  saveCardContent: (data) => api.put(`/card/${data.title}`, data),
  getCardContent: (data) => api.get(`/card/${data.title}`, data),
};

export const aiAPI = {
  generatePrompt: (data) => api.post('/ai/generate-prompt', data),
  generateGuidance: (data) => api.post('/ai/generate-guidance', data),
  submitFeedback: (data) => api.post('/ai/submit-feedback', data),
  dashboardAnalysis: (data) => api.post('/ai/dashboard-analysis', data)
};

export function apiTest() {
  return api.get("/hello");
}

export default api;