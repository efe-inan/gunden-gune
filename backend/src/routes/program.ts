import { Router } from 'express';
import {
  createProgram,
  getCurrentProgram,
  getProgramById,
  updateProgress,
  getTasksForDay,
  completeTask,
  uncompleteTask,
  submitReflection,
  getCurrentDayProgram,
  getDayProgram,
} from '../controllers/programController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { createProgramSchema, updateProgressSchema } from '../config/validation';

const router = Router();

router.post('/', authenticate, validateBody(createProgramSchema), asyncHandler(createProgram));
router.get('/current', authenticate, asyncHandler(getCurrentProgram));
router.get('/day', authenticate, asyncHandler(getCurrentDayProgram));
router.post('/complete-task', authenticate, asyncHandler(completeTask));
router.post('/uncomplete-task', authenticate, asyncHandler(uncompleteTask));
router.post('/reflection', authenticate, asyncHandler(submitReflection));
router.get('/:id', authenticate, asyncHandler(getProgramById));
router.put('/:id/progress', authenticate, validateBody(updateProgressSchema), asyncHandler(updateProgress));
router.get('/:id/tasks/:day', authenticate, asyncHandler(getTasksForDay));

export default router;
