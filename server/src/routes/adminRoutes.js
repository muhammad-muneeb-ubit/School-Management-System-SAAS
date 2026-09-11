import express from 'express';
import { createBranch, updateMaxBranches, createPrincipal, getSettings, getBranches, getUsers, getPrincipals, updatePrincipalBranch, getPublicSettings, updateTheme } from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require login AND the Super Admin role
// router.use(protect, authorize('Super Admin'));

router.post('/branches', protect, authorize('Super Admin'), createBranch);
router.put('/settings/max-branches', protect, authorize('Super Admin'), updateMaxBranches);
router.post('/principal', protect, authorize('Super Admin'), createPrincipal);
router.get('/settings', protect, authorize('Super Admin'), getSettings);
router.get('/branches',protect, authorize('Super Admin'),  getBranches);
router.get('/users', protect, authorize('Super Admin'), getUsers);
// Add these
router.get('/principals', protect, authorize('Super Admin'), getPrincipals);
// createPrincipal route already exists as router.post('/principal', ...)
router.put('/principals/:id/branch', protect, authorize('Super Admin'), updatePrincipalBranch);
// Public route (No auth needed)
router.get('/settings/public', getPublicSettings);

// Super Admin route
router.put('/settings/theme', protect, authorize('Super Admin'), updateTheme);
export default router;