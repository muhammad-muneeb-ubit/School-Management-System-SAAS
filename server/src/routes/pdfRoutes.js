import express from 'express';
import { 
    downloadStudentList, downloadAttendanceSheet, downloadFeeDefaulters, 
    downloadFeeReceipt, downloadTimetable, downloadClassResult, downloadReportCard
} from '../controllers/pdfController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require login. Most are Principal only, except Receipt which Parent/Student can view.
router.get('/students', protect, authorize('Principal'), downloadStudentList);
router.get('/attendance-sheet', protect, authorize('Principal', 'Teacher'), downloadAttendanceSheet);
router.get('/fee-defaulters', protect, authorize('Principal'), downloadFeeDefaulters);
router.get('/fee-receipt/:id', protect, authorize('Principal', 'Parent', 'Student'), downloadFeeReceipt);
router.get('/timetable', protect, authorize('Principal', 'Teacher', 'Student', 'Parent'), downloadTimetable);
router.get('/class-result', protect, authorize('Principal'), downloadClassResult);
router.get('/report-card/:examId/:studentId', protect, authorize('Principal', 'Parent', 'Student'), downloadReportCard);
export default router;