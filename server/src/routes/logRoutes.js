import express from 'express';
import { getActivityLogs } from '../controllers/logController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('Principal', 'Super Admin'), getActivityLogs);

export default router;