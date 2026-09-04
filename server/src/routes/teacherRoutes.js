import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createTeacher, assignTeacher, getTeachers, getMyAssignments, resetUserPassword, deleteTeacher } from '../controllers/teacherController.js';

const router = express.Router();

// Principal routes
router.route('/')
    .post(protect, authorize('Principal'), createTeacher)
    .get(protect, authorize('Principal'), getTeachers);

router.put('/:id/assign', protect, authorize('Principal'), assignTeacher);

// Teacher route
router.get('/my-assignments', protect, authorize('Teacher'), getMyAssignments);
router.put('/users/:id/reset-password', protect, authorize('Principal'), resetUserPassword);
router.delete('/:id', protect, authorize('Principal'), deleteTeacher);
export default router;