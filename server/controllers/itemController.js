import Item from '../models/Item.js';

// @desc    Fetch all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const items = await Item.find({ ...keyword, ...category })
            .populate('owner', 'name avatar trustScore rating')
            .sort('-createdAt');
            
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch my items
// @route   GET /api/items/my
// @access  Private
export const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ owner: req.user._id })
            .populate('owner', 'name avatar trustScore rating')
            .sort('-createdAt');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single item
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('owner', 'name avatar trustScore rating');

        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
    try {
        const { title, description, image, category, availability, location } = req.body;

        const item = new Item({
            title,
            description,
            image,
            category,
            availability,
            location,
            owner: req.user._id
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (item) {
            // Check if user is owner
            if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this item' });
            }

            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
