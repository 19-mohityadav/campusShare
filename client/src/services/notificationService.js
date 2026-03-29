import api, { withFallback } from './api';
import { MOCK_NOTIFICATIONS } from './mockData';

const notificationService = {
    getNotifications: async () => {
        return withFallback(() => api.get('/notifications'), MOCK_NOTIFICATIONS);
    },

    markAsRead: async (notifId) => {
        try {
            const { data } = await api.put(`/notifications/${notifId}/read`);
            return data;
        } catch (error) {
            return { message: 'Marked read (mock)' };
        }
    },
    
    markAllAsRead: async () => {
        try {
            const { data } = await api.put('/notifications/read-all');
            return data;
        } catch (error) {
            return { message: 'All marked read (mock)' };
        }
    }
};

export default notificationService;
