import express from 'express';
import { createBranch, updateMaxBranches, createPrincipal, getSettings, getBranches, getUsers, getPrincipals, updatePrincipalBranch} from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require login AND the Super Admin role
router.use(protect, authorize('Super Admin'));

router.post('/branches', createBranch);
router.put('/settings/max-branches', updateMaxBranches);
router.post('/principal', createPrincipal);
router.get('/settings', getSettings);
router.get('/branches', getBranches);
router.get('/users', getUsers);
// Add these
router.get('/principals', getPrincipals);
// createPrincipal route already exists as router.post('/principal', ...)
router.put('/principals/:id/branch', updatePrincipalBranch);
export default router;