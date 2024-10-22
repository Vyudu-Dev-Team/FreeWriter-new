import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getStories = () => api.get('/stories');
export const createStory = (storyData) => api.post('/stories', storyData);

// Add other API calls as needed