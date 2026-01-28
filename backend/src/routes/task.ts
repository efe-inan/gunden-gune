import { Router } from 'express';
import { getTodayTasks, completeTask, addReflection } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { reflectionSchema } from '../config/validation';

const router = Router();

router.get('/today', authenticate, asyncHandler(getTodayTasks));
router.put('/:id/complete', authenticate, asyncHandler(completeTask));
router.post('/:id/reflection', authenticate, validateBody(reflectionSchema), asyncHandler(addReflection));

export default router;
