import User from '../models/User.js';

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update logged in user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, avatar, phone } = req.body;
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (phone) user.phone = phone;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            phone: updatedUser.phone,
            role: updatedUser.role,
            rating: updatedUser.rating,
            reviewCount: updatedUser.reviewCount,
            trustScore: updatedUser.trustScore
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get public user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name avatar rating reviewCount trustScore createdAt');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
