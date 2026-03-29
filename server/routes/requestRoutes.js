import express from 'express';
import { createRequest, getMyRequests, updateRequestStatus } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createRequest);

router.route('/my')
    .get(protect, getMyRequests);

router.route('/:id')
    .put(protect, updateRequestStatus);

export default router;
