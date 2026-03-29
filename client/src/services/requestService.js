import api from './api';

const MOCK_REQUESTS = [
    {
        _id: 'mock-req-1',
        item: { _id: 'mock-1', title: 'Scientific Calculator', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', category: 'Calculator' },
        borrower: { _id: 'current-user', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
        lender: { _id: 'mock-user-1', name: 'Raj Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj' },
        status: 'pending',
        message: 'Hi, can I borrow this for my exam tomorrow?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: 'mock-req-2',
        item: { _id: 'mock-3', title: 'Drawing Kit', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400', category: 'Lab Tools' },
        borrower: { _id: 'mock-user-3', name: 'Aman Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman' },
        lender: { _id: 'current-user', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
        status: 'accepted',
        message: 'I need it for my design project this week.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: 'mock-req-3',
        item: { _id: 'mock-2', title: 'Physics Textbook Vol 2', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', category: 'Books' },
        borrower: { _id: 'current-user', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
        lender: { _id: 'mock-user-2', name: 'Simran Kaur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran' },
        status: 'completed',
        message: 'Need for semester exams.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
];

const requestService = {
    // Create a request
    createRequest: async (itemId, message = '') => {
        const { data } = await api.post('/requests', { item: itemId, message });
        return data;
    },

    // Get my requests (borrowing, lending, or all)
    getMyRequests: async (type = '') => {
        try {
            const params = type ? { type } : {};
            const { data } = await api.get('/requests/my', { params });
            return data;
        } catch (error) {
            console.warn('Requests API unavailable, using mock data');
            return MOCK_REQUESTS;
        }
    },

    // Update request status
    updateStatus: async (requestId, status) => {
        const { data } = await api.put(`/requests/${requestId}`, { status });
        return data;
    }
};

export default requestService;
