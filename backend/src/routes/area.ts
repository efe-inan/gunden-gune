import { Router } from 'express';
import { getAllAreas, getAreaById, submitTest } from '../controllers/areaController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { testSubmissionSchema } from '../config/validation';

const router = Router();

router.get('/', authenticate, asyncHandler(getAllAreas));
router.get('/:id', authenticate, asyncHandler(getAreaById));
router.post('/:id/test', authenticate, validateBody(testSubmissionSchema), asyncHandler(submitTest));

export default router;
