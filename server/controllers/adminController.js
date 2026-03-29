import User from '../models/User.js';
import Item from '../models/Item.js';
import Request from '../models/Request.js';
import Review from '../models/Review.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const [userCount, itemCount, requestCount, reviewCount] = await Promise.all([
            User.countDocuments(),
            Item.countDocuments(),
            Request.countDocuments(),
            Review.countDocuments()
        ]);

        const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email avatar createdAt role');
        const recentItems = await Item.find().sort('-createdAt').limit(5).populate('owner', 'name avatar');

        const requestsByStatus = await Request.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            stats: { userCount, itemCount, requestCount, reviewCount },
            recentUsers,
            recentItems,
            requestsByStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt').select('-password -otp');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all items (admin)
// @route   GET /api/admin/items
// @access  Private/Admin
export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find().sort('-createdAt').populate('owner', 'name email');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete item (admin)
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
export const adminDeleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed demo data
// @route   POST /api/admin/seed
// @access  Private/Admin
export const seedDemoData = async (req, res) => {
    try {
        // Only seed if DB is empty
        const existingItems = await Item.countDocuments();
        if (existingItems > 0) {
            return res.json({ message: 'Data already exists, skipping seed' });
        }

        // Find an existing user to be the owner, or skip
        const demoUser = await User.findOne({ role: 'user' });
        if (!demoUser) {
            return res.status(400).json({ message: 'No users found to assign items to. Register first.' });
        }

        const demoItems = [
            { title: 'Scientific Calculator', description: 'Casio fx-991ES Plus. Perfect for engineering. Good condition.', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', category: 'Calculator', location: 'Hostel Block B', availability: 'Available for next 7 days', owner: demoUser._id },
            { title: 'Physics Textbook Vol 2', description: 'HC Verma Volume 2. All concepts covered. Minor highlights.', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', category: 'Books', location: 'Library Gate', availability: 'Available this weekend', owner: demoUser._id },
            { title: 'Drawing Kit', description: 'Full pencil set, charcoals, sketchpad. Barely used.', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400', category: 'Lab Tools', location: 'Academic Block 1', availability: 'Available Monday-Friday', owner: demoUser._id },
            { title: 'JBL Bluetooth Speaker', description: 'JBL Flip 4. 12hr battery. Waterproof. Great sound.', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', category: 'Electronics', location: 'Canteen Area', availability: 'Available after 5PM', owner: demoUser._id },
            { title: 'Lab Equipment Set', description: 'Chemistry lab kit: beakers, test tubes, safety goggles.', image: 'https://images.unsplash.com/photo-1532094349884-543559cc9f36?w=400', category: 'Lab Tools', location: 'Science Block', availability: 'Available next 3 days', owner: demoUser._id },
        ];

        await Item.insertMany(demoItems);
        res.json({ message: `Seeded ${demoItems.length} demo items successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
