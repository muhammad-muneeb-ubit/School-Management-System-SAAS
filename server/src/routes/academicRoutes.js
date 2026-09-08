import express from 'express';
import { createSession, setCurrentSession, createClass, getClasses, createSection, createSubject, getSections, getSubjects, getSessions } from '../controllers/academicController.js';
import { setTimetable, getTimetable, getMyTimetable } from '../controllers/timetableController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require login and must be a Principal
// router.use(protect, authorize('Principal', 'Teacher'));

// Session routes
router.post('/sessions', protect, authorize('Principal'), createSession);
router.get('/sessions', protect, authorize('Principal', 'Teacher', 'Parent'), getSessions); // Allow Teacher to see sessions
router.put('/sessions/:id/set-current', protect, authorize('Principal'), setCurrentSession);

// Class routes
router.post('/classes', protect, authorize('Principal'), createClass);
router.get('/classes', protect, authorize('Principal', 'Teacher'), getClasses);

// Section & Subject Routes (Principal creates, Teacher views)
router.post('/classes/:classId/sections', protect, authorize('Principal'), createSection);
router.post('/classes/:classId/subjects', protect, authorize('Principal'), createSubject);
router.get('/classes/:classId/sections', protect, authorize('Principal', 'Teacher'), getSections);
router.get('/classes/:classId/subjects', protect, authorize('Principal', 'Teacher'), getSubjects);


// Timetable Routes (Principal manages, Teacher views)
router.put('/timetable', protect, authorize('Principal'), setTimetable);
router.get('/timetable', protect, authorize('Principal', 'Teacher', 'Parent'), getTimetable);
router.get('/timetable/my-timetable', protect, authorize('Teacher'), getMyTimetable);

export default router;