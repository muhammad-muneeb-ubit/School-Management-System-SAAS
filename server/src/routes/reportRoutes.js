import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getFeeDefaulters, getClassAttendanceSummary, getStudentSummary, getClassRanking, getDashboardStats } from '../controllers/reportController.js';

const router = express.Router();

// Principal routes
router.get('/fee-defaulters', protect, authorize('Principal'), getFeeDefaulters);
router.get('/attendance-summary', protect, authorize('Principal'), getClassAttendanceSummary);

// Parent & Principal routes
router.get('/student-summary/:studentId', protect, authorize('Parent', 'Principal'), getStudentSummary);
router.get('/class-ranking', protect, authorize('Principal'), getClassRanking);
router.get('/dashboard-stats', protect, authorize('Principal'), getDashboardStats);
export default router;