import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminStats,
  getAllPrograms,
  createDevelopmentArea,
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { developmentAreaSchema } from '../config/validation';

const router = Router();

router.get('/stats', authenticate, asyncHandler(getAdminStats));
router.get('/users', authenticate, asyncHandler(getAllUsers));
router.get('/users/:id', authenticate, asyncHandler(getUserById));
router.put('/users/:id', authenticate, asyncHandler(updateUser));
router.delete('/users/:id', authenticate, asyncHandler(deleteUser));
router.get('/programs', authenticate, asyncHandler(getAllPrograms));
router.post('/areas', authenticate, validateBody(developmentAreaSchema), asyncHandler(createDevelopmentArea));

export default router;
