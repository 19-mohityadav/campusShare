import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    targetUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per transaction/user if needed later
// reviewSchema.index({ reviewer: 1, targetUser: 1, item: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
