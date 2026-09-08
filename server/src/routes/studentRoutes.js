import express from 'express';
import { admitStudent, getStudents, getMyChildren, updateStudentStatus, getStudentById} from '../controllers/studentController.js';
import { bulkImportStudents } from '../controllers/bulkImportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/bulk-import', protect, authorize('Principal', 'Teacher'), bulkImportStudents);

// Principal routes for admitting and viewing students
router.route('/')
    .post(protect, authorize('Principal'), admitStudent)
    .get(protect, authorize('Principal', 'Teacher'), getStudents);

// Parent route to view their own children
router.get('/my-children', protect, authorize('Parent'), getMyChildren);
router.put('/:id/status', protect, authorize('Principal'), updateStudentStatus);
router.get('/:id', protect, authorize('Principal', 'Teacher'), getStudentById);
export default router;