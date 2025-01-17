const BASE_URL = '/.netlify/functions';

class ApiService {
    static async aiInteraction(message) {
        try {
            const response = await fetch(`${BASE_URL}/api/ai/interaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
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