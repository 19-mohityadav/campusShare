import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc    Create a review for a user
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { targetUserId, itemId, rating, comment } = req.body;

        if (!targetUserId || !rating || !comment) {
            return res.status(400).json({ message: 'Please provide targetUserId, rating, and comment' });
        }

        // Prevent self-review
        if (targetUserId === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot review yourself' });
        }

        const review = new Review({
            reviewer: req.user._id,
            targetUser: targetUserId,
            item: itemId || null,
            rating,
            comment
        });

        await review.save();

        // Update target user's average rating
        const reviews = await Review.find({ targetUser: targetUserId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await User.findByIdAndUpdate(targetUserId, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ targetUser: req.params.userId })
            .populate('reviewer', 'name avatar')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
