import express from 'express';
import { createFeeStructure, generateMonthlyFees, recordPayment, getMyFees, getAllFees } from '../controllers/feeController.js';
import { markAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { protectArchivedSession } from '../middleware/sessionGuard.js';
const router = express.Router();

// Principal routes
router.route('/').get(protect, authorize('Principal'), getAllFees); // Add this
router.post('/structure', protect, authorize('Principal'), createFeeStructure);
router.post('/generate', protect, authorize('Principal'), generateMonthlyFees);
router.put('/:id/pay', protect, authorize('Principal'), recordPayment);
router.post('/', protect, authorize('Teacher', 'Principal'), protectArchivedSession, markAttendance);
// Parent/Student route
router.get('/my-fee', protect, authorize('Parent', 'Student'), getMyFees);

export default router;