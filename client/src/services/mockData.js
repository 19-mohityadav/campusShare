/**
 * CampusShare — Mock Data
 * Used as fallback when API/DB is unavailable.
 */

export const MOCK_USER = {
    _id: 'mock_user_001',
    name: 'Demo User',
    email: 'demo@campus.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    role: 'user',
    rating: 4.8,
    reviewCount: 12,
    trustScore: 95,
    token: 'mock_jwt_token_demo',
};

export const MOCK_ITEMS = [
    {
        _id: 'item_001',
        title: 'Scientific Calculator (Casio fx-991)',
        category: 'Electronics',
        description: 'Perfect for engineering exams. Advanced scientific calculator with 552 functions.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&q=80',
        owner: { _id: 'mock_user_002', name: 'Priya S.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', rating: 4.9 },
        available: true,
        location: 'Hostel Block A',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'item_002',
        title: 'Data Structures Textbook (CLRS)',
        category: 'Books',
        description: 'Introduction to Algorithms, 3rd Edition. Very well maintained.',
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
        owner: { _id: 'mock_user_003', name: 'Arjun M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', rating: 4.7 },
        available: true,
        location: 'Library Block',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'item_003',
        title: 'Portable Projector',
        category: 'Electronics',
        description: 'Mini LED projector, great for group study sessions and presentations.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?w=400&q=80',
        owner: { _id: 'mock_user_004', name: 'Meera K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera', rating: 5.0 },
        available: false,
        location: 'Engineering Block',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'item_004',
        title: 'Laptop Stand + Cooling Pad',
        category: 'Accessories',
        description: 'Aluminum adjustable stand with USB-powered dual fans.',
        condition: 'Mint',
        imageUrl: 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=400&q=80',
        owner: { _id: 'mock_user_005', name: 'Rahul T.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', rating: 4.6 },
        available: true,
        location: 'CS Department',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'item_005',
        title: 'Drawing Kit (Architecture)',
        category: 'Stationery',
        description: 'Complete architectural drawing set with drafting board and tools.',
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        owner: { _id: 'mock_user_006', name: 'Kavita R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kavita', rating: 4.8 },
        available: true,
        location: 'Architecture Block',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'item_006',
        title: 'Chemistry Lab Coat',
        category: 'Lab Equipment',
        description: 'White lab coat, size M, worn only twice. Clean and pressed.',
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80',
        owner: { _id: 'mock_user_007', name: 'Dev P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', rating: 4.5 },
        available: true,
        location: 'Science Block',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const MOCK_REQUESTS = [
    {
        _id: 'req_001',
        item: MOCK_ITEMS[0],
        requester: MOCK_USER,
        owner: MOCK_ITEMS[0].owner,
        status: 'pending',
        message: 'Need it for my semester exams next week.',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'req_002',
        item: MOCK_ITEMS[1],
        requester: { _id: 'mock_user_003', name: 'Arjun M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun' },
        owner: MOCK_USER,
        status: 'approved',
        message: 'Studying for GATE exam.',
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const MOCK_MESSAGES = [
    { _id: 'msg_001', sender: { _id: 'mock_user_002', name: 'Priya S.' }, text: 'Hi! Is the calculator still available?', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { _id: 'msg_002', sender: MOCK_USER, text: 'Yes it is! You can pick it up from Hostel Block A anytime.', createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
    { _id: 'msg_003', sender: { _id: 'mock_user_002', name: 'Priya S.' }, text: 'That\'s great! I\'ll come tomorrow afternoon.', createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
];

export const MOCK_NOTIFICATIONS = [
    { _id: 'notif_001', type: 'request', message: 'Arjun M. requested your CLRS textbook.', read: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { _id: 'notif_002', type: 'approved', message: 'Your request for Scientific Calculator was approved!', read: false, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { _id: 'notif_003', type: 'review', message: 'Priya S. left you a 5-star review.', read: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

export const MOCK_ADMIN_STATS = {
    totalUsers: 147,
    totalItems: 83,
    totalRequests: 62,
    activeLoans: 18,
    pendingRequests: 14,
    completedLoans: 44,
};
