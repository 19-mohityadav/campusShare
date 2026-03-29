import Request from '../models/Request.js';
import Item from '../models/Item.js';

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
    try {
        const { item: itemId, message } = req.body;

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Prevent owner from requesting their own item
        if (item.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot request your own item' });
        }

        // Check if item is available
        if (item.status !== 'available') {
            return res.status(400).json({ message: 'Item is not currently available' });
        }

        // Check if user already requested this item and it's pending
        const existingRequest = await Request.findOne({
            item: itemId,
            borrower: req.user._id,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have an active request for this item' });
        }

        const request = new Request({
            item: itemId,
            borrower: req.user._id,
            lender: item.owner,
            message
        });

        const createdRequest = await request.save();
        
        // Update item status
        item.status = 'requested';
        await item.save();

        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user requests (as borrower or lender)
// @route   GET /api/requests/my
// @access  Private
export const getMyRequests = async (req, res) => {
    try {
        const type = req.query.type; // 'borrowing' or 'lending'
        let query = {};

        if (type === 'borrowing') {
            query = { borrower: req.user._id };
        } else if (type === 'lending') {
            query = { lender: req.user._id };
        } else {
            query = { $or: [{ borrower: req.user._id }, { lender: req.user._id }] };
        }

        const requests = await Request.find(query)
            .populate('item', 'title image category')
            .populate('borrower', 'name avatar')
            .populate('lender', 'name avatar')
            .sort('-createdAt');

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status (Accept/Reject/Complete)
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findById(req.params.id).populate('item');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Allow lender to accept/reject/complete
        if (request.lender.toString() === req.user._id.toString()) {
            if (['accepted', 'rejected', 'completed'].includes(status)) {
                request.status = status;
                await request.save();

                // Update item status based on request status
                if (status === 'accepted') {
                    request.item.status = 'borrowed';
                } else if (status === 'rejected' || status === 'completed') {
                    // Check if other pending requests exist for this item
                    const otherPending = await Request.findOne({
                        item: request.item._id,
                        status: 'pending'
                    });
                    request.item.status = otherPending ? 'requested' : 'available';
                }
                
                await request.item.save();
                return res.json(request);
            }
        } 
        
        // Allow borrower to cancel
        if (request.borrower.toString() === req.user._id.toString()) {
            if (status === 'cancelled') {
                request.status = status;
                await request.save();
                
                // Reset item if it was just requested
                const otherPending = await Request.findOne({
                        item: request.item._id,
                        status: 'pending'
                });
                request.item.status = otherPending ? 'requested' : 'available';
                await request.item.save();

                return res.json(request);
            }
        }

        res.status(401).json({ message: 'Not authorized to perform this update or invalid status' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
