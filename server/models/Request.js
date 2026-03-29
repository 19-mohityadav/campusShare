import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: true
    },
    borrower: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    lender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
