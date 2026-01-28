import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount, getStats } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { updateProfileSchema } from '../config/validation';

const router = Router();

router.get('/profile', authenticate, asyncHandler(getProfile));
router.put('/profile', authenticate, validateBody(updateProfileSchema), asyncHandler(updateProfile));
router.delete('/account', authenticate, asyncHandler(deleteAccount));
router.get('/stats', authenticate, asyncHandler(getStats));

export default router;
