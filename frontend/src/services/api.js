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
    // Verify token is actually set
    console.log("Token set:", api.defaults.headers.common["Authorization"]);
  } else {
    delete api.defaults.headers.common["Authorization"];
    console.log("Token removed");
  }
};

export const userAPI = {
  getCurrentUser: () => api.get("/users/current-user"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  login: (email, password) => api.post("/users/login", { email, password }),
  register: (username, email, password, writingMode, deviceToken) =>
    api.post("/users/register", { 
      username, 
      email, 
      password, 
      writingMode,
      deviceToken 
    }),
    verifyEmail: (token) => api.post('/users/verify-email', { token }),
  forgotPassword: (email) => api.post("/users/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/users/reset-password", { token, newPassword }),
  resendVerification: (email) =>
    api.post("/users/resend-verification", { email }),
  getPreferences: () => api.get("/users/preferences"),
  updatePreferences: (preferences) =>
    api.put("/users/preferences", preferences),
  resetPreferences: () => api.post("/users/reset-preferences"),
  getDecks: () => api.get("/decks"),
  createDeck: (deckData) => api.post("/decks", deckData),
  createCard: (deckId, cardData) => api.post(`/decks/${deckId}/cards`, cardData),
};

export const storyAPI = {
  createStory: (data) => api.post('/stories', data),
  updateStory: (id, data) => api.put(`/stories/${id}`, data),
  deleteStory: (id) => api.delete(`/stories/${id}`),
  getStories: () => api.get('/stories'),
};

export const deckAPI = {
  getDecks: () => api.get("/decks"),
  createDeck: (deckData) => api.post("/decks", deckData),
  createCard: (deckId, cardData) => api.post(`/decks/${deckId}/cards`, cardData),
  saveCardContent: (data) => api.put(`/card/${data.title}`, data),
  getCardContent: (data) => api.get(`/card/${data.title}`, data),
};

export const aiAPI = {
  generatePrompt: (data) => api.post('/ai/generate-prompt', data),
  generateGuidance: (data) => api.post('/ai/generate-guidance', data),
  submitFeedback: (data) => api.post('/ai/submit-feedback', data),
  dashboardAnalysis: (data) => api.post('/ai/dashboard-analysis', data)
};

export const apiTest = async () => {
  try {
    const response = await api.get('/test');
    alert("API Connection Successful!");
  } catch (error) {
    console.error("API Test Failed:", error);
    alert("API Connection Failed");
  }
};

export const fcmAPI = {
  testNotification: () => api.post("/notifications/test"),
  getPermission: () => api.get("/notifications/permission"),
  saveToken: (token) => api.post("/notifications/token", { token }),
};

export default api;