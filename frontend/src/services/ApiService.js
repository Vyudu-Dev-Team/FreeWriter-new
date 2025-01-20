const BASE_URL = '/.netlify/functions';

class ApiService {
    static getAuthToken() {
        return localStorage.getItem('token');
    }

    static async aiInteraction(message) {
        try {
            const token = this.getAuthToken();
            const response = await fetch(`${BASE_URL}/api/ai/interaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido ou expirado
                    throw new Error('Unauthorized: Please log in again');
                }
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in AI interaction:', error);
            throw error;
        }
    }
}

export default ApiService; 