import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        required: [true, 'Please add an image']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Books', 'Calculator', 'Lab Tools', 'Electronics', 'Gadgets', 'Essentials', 'Other']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    availability: {
        type: String,
        default: 'Available for next 7 days'
    },
    status: {
        type: String,
        enum: ['available', 'requested', 'borrowed'],
        default: 'available'
    },
    location: {
        type: String,
        required: [true, 'Please add a pickup location']
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
