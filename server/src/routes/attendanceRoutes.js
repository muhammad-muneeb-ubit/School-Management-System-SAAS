import express from 'express';
import { markAttendance, getAttendanceByDate, getMyAttendanceHistory} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { protectArchivedSession } from '../middleware/sessionGuard.js';
const router = express.Router();

// Teacher & Principal routes
router.route('/')
    .post(protect, authorize('Teacher', 'Principal'), markAttendance)
    .get(protect, authorize('Teacher', 'Principal'), getAttendanceByDate);
router.post('/', protect, authorize('Teacher', 'Principal'), protectArchivedSession, markAttendance);
// Parent & Student route
router.get('/my-history', protect, authorize('Parent', 'Student'), getMyAttendanceHistory);

export default router;