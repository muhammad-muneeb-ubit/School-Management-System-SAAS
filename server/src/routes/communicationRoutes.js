import express from 'express';
import { 
    createAnnouncement, getAnnouncements, 
    createHomework, getHomework 
} from '../controllers/communicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Announcements
router.route('/announcements')
    .post(protect, authorize('Principal'), createAnnouncement)
    .get(protect, authorize('Super Admin', 'Principal', 'Teacher', 'Student', 'Parent'), getAnnouncements);

// Homework
router.route('/homework')
    .post(protect, authorize('Teacher', 'Principal'), createHomework)
    .get(protect, authorize('Principal', 'Teacher', 'Student', 'Parent'), getHomework);

export default router;