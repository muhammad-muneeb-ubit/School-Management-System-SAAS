import express from 'express';
import { createBranch, updateMaxBranches, createPrincipal } from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require login AND the Super Admin role
router.use(protect, authorize('Super Admin'));

router.post('/branches', createBranch);
router.put('/settings/max-branches', updateMaxBranches);
router.post('/principal', createPrincipal);

export default router;