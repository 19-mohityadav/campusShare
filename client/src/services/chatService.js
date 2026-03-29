import api, { withFallback } from './api';
import { MOCK_MESSAGES } from './mockData';

const chatService = {
    getChats: async () => {
        return withFallback(() => api.get('/chats'), []);
    },

    getMessages: async (chatId) => {
        return withFallback(() => api.get(`/chats/${chatId}/messages`), MOCK_MESSAGES);
    },

    sendMessage: async (chatId, text) => {
        try {
            const { data } = await api.post(`/chats/${chatId}/messages`, { text });
            return data;
        } catch (error) {
            console.warn('Chat API unavailable, mocking message send');
            // Mock a returned message structure
            return {
                _id: `msg_mock_${Date.now()}`,
                sender: { _id: JSON.parse(localStorage.getItem('user'))?._id || 'current-user', name: 'You' },
                text,
                createdAt: new Date().toISOString()
            };
        }
    }
};

export default chatService;
