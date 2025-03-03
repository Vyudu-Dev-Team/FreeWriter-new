import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions/api'
  : '/.netlify/functions/api');

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
    static async startNewInteraction(message) {
        try {
            const response = await api.post('/ai/interaction', { message });
            return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async continueInteraction(conversationId, message) {
        try {
            const response = await api.post('/ai/interaction', { 
                message,
                conversationId 
            });
            return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async getInteractionHistory(conversationId) {
        try {
            const response = await api.get(`/ai/interaction/${conversationId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async getAllInteractions() {
        try {
            const response = await api.get('/ai/interaction');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async fetchConversationHistory(conversationId) {
        try {
            const response = await fetch(`/ai/interaction/${conversationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar histórico da conversa');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            throw error;
        }
    }

    static handleError(error) {
        if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please log in again');
        }
        console.error('API Error:', error);
        throw error;
    }
}

export default ApiService; 