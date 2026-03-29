import api, { withFallback } from './api';
import { MOCK_ITEMS } from './mockData';

const itemService = {
    // Get all items with optional query params
    getItems: async (params = {}) => {
        return withFallback(() => api.get('/items', { params }), MOCK_ITEMS);
    },

    // Get items posted by the current user
    getMyItems: async () => {
        return withFallback(() => api.get('/items/my'), []);
    },

    // Get single item
    getItemById: async (id) => {
        return withFallback(
            () => api.get(`/items/${id}`),
            MOCK_ITEMS.find((i) => i._id === id) || MOCK_ITEMS[0]
        );
    },

    // Create item
    createItem: async (itemData) => {
        try {
            const res = await api.post('/items', itemData);
            return res.data;
        } catch (err) {
            if (!err.response) {
                // Mock creation
                const newItem = {
                    _id: `item_mock_${Date.now()}`,
                    ...itemData,
                    available: true,
                    createdAt: new Date().toISOString(),
                };
                MOCK_ITEMS.unshift(newItem);
                return newItem;
            }
            throw err;
        }
    },

    // Update item
    updateItem: async (id, itemData) => {
        try {
            const res = await api.put(`/items/${id}`, itemData);
            return res.data;
        } catch (_) {
            return { _id: id, ...itemData };
        }
    },

    // Delete item
    deleteItem: async (id) => {
        try {
            const res = await api.delete(`/items/${id}`);
            return res.data;
        } catch (_) {
            return { message: 'Item deleted (mock)' };
        }
    },

    // Upload image to Cloudinary via backend
    uploadImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.imageUrl; // Fixed: Backend returns imageUrl, not url
        } catch (_) {
            return null;
        }
    },
};

export { MOCK_ITEMS };
export default itemService;
