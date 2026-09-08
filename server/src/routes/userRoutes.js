import express from 'express';
import { resetUserPassword} from '../controllers/teacherController.js'; // We put the controller in teacherController
import { createParent, getParents} from '../controllers/superAdminController.js'; // We put the controller in teacherController
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Principal resets password for any user (Teacher/Parent)
router.put('/:id/reset-password', protect, authorize('Super Admin', 'Principal'), resetUserPassword);
router.get('/parents', protect, authorize('Super Admin', 'Principal'), getParents);
router.post('/parent', protect, authorize('Principal'), createParent);
export default router;