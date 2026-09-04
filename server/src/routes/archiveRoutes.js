import express from 'express';
import { exportSessionData, importSessionData } from '../controllers/archiveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/export/:sessionId', protect, authorize('Principal'), exportSessionData);
router.post('/import', protect, authorize('Principal'), importSessionData);

export default router;