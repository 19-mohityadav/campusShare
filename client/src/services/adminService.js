import api, { withFallback } from './api';
import { MOCK_ADMIN_STATS } from './mockData';

const adminService = {
    getStats: async () => {
        return withFallback(() => api.get('/admin/stats'), MOCK_ADMIN_STATS);
    },

    getUsers: async () => {
        return withFallback(() => api.get('/admin/users'), []);
    },

    deleteUser: async (userId) => {
        try {
            const { data } = await api.delete(`/admin/users/${userId}`);
            return data;
        } catch (error) {
            return { message: 'User deleted (mock)' };
        }
    },

    deleteItem: async (itemId) => {
        try {
            const { data } = await api.delete(`/admin/items/${itemId}`);
            return data;
        } catch (error) {
            return { message: 'Item deleted (mock)' };
        }
    }
};

export default adminService;
