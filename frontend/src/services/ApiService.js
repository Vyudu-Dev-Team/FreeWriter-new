import axios from 'axios';

const BASE_URL = '/.netlify/functions';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class ApiService {
    static async aiInteraction(message = null) {
        try {
            if (message === null) {
                // GET request for history
                const response = await api.get('/api/ai/interaction');
                return response.data;
            } else {
                // POST request for new message
                const response = await api.post('/api/ai/interaction', { message });
                return response.data;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized: Please log in again');
            }
            console.error('Error in AI interaction:', error);
            throw error;
        }
    }
}

export default ApiService; 