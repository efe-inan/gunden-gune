import { Router } from 'express';
import { getProgress, updateProgress } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProgress);
router.put('/', authenticate, updateProgress);

export default router;
