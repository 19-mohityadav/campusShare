import express from 'express';
import { getAdminStats, getAllUsers, deleteUser, getAllItems, adminDeleteItem, seedDemoData } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin); // All admin routes require auth + admin role

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/items', getAllItems);
router.delete('/items/:id', adminDeleteItem);
router.post('/seed', seedDemoData);

export default router;
