import express from 'express';
import { createExam, enterMarks, publishResults, getStudentResult, getExams, getStudentAllResults} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { protectArchivedSession } from '../middleware/sessionGuard.js';
import { markAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

// Principal routes
router.post('/', protect, authorize('Principal'), createExam);
router.put('/:examId/publish', protect, authorize('Principal'), publishResults);
router.post('/', protect, authorize('Teacher', 'Principal'), protectArchivedSession, markAttendance);
// Teacher route
router.put('/:examId/marks', protect, authorize('Teacher', 'Principal'), enterMarks);

// Parent/Student route
router.get('/:examId/result', protect, authorize('Parent', 'Student', 'Principal'), getStudentResult);
router.get('/', protect, authorize('Principal', 'Teacher'), getExams);
router.get('/student-results/:studentId', protect, authorize('Parent', 'Student', 'Principal'), getStudentAllResults);


export default router;