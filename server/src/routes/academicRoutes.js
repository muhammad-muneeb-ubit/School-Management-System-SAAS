import express from 'express';
import {
    createSession,
    setCurrentSession,
    createClass,
    getClasses,
    createSection,
    createSubject,
    getSections,
    getSubjects
} from '../controllers/academicController.js';
import { setTimetable, getTimetable, getMyTimetable } from '../controllers/timetableController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require login and must be a Principal
router.use(protect, authorize('Principal'));

// Session routes
router.post('/sessions', createSession);
router.put('/sessions/:id/set-current', setCurrentSession);

// Class routes
router.post('/classes', createClass);
router.get('/classes', getClasses);

// Section & Subject routes
router.post('/classes/:classId/sections', createSection);
router.post('/classes/:classId/subjects', createSubject);

// New Timetable Routes
router.put('/timetable', setTimetable); // Principal sets timetable
router.get('/timetable', getTimetable); // Principal/Teacher gets class timetable

router.get('/classes/:classId/sections', getSections);
router.get('/classes/:classId/subjects', getSubjects);

// Teacher specific route
router.get('/timetable/my-timetable', protect, authorize('Teacher'), getMyTimetable);
export default router;