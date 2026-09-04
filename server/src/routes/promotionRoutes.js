import express from 'express';
import { submitRecommendation, getRecommendations, executePromotion } from '../controllers/promotionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Teacher routes
router.post('/recommend', protect, authorize('Teacher', 'Principal'), submitRecommendation);
router.get('/recommendations', protect, authorize('Principal'), getRecommendations);

// Principal route
router.post('/execute', protect, authorize('Principal'), executePromotion);

export default router;