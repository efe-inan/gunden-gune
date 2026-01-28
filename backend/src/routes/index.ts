import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import areaRoutes from './area';
import programRoutes from './program';
import taskRoutes from './task';
import blogRoutes from './blog';
import adminRoutes from './admin';
import uploadRoutes from './upload';
import progressRoutes from './progress';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/areas', areaRoutes);
router.use('/programs', programRoutes);
router.use('/tasks', taskRoutes);
router.use('/blog', blogRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/progress', progressRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

export default router;
