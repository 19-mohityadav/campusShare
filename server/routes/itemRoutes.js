import express from 'express';
import { getItems, getMyItems, getItemById, createItem, deleteItem } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getItems)
    .post(protect, createItem);

router.route('/my')
    .get(protect, getMyItems);

router.route('/:id')
    .get(getItemById)
    .delete(protect, deleteItem);

export default router;
