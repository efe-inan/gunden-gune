import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/', authenticate, uploadRateLimiter, (req, res, next) => {
  uploadSingle(req, res, (err: any) => {
    if (err) next(err);
    else uploadFile(req, res);
  });
});

export default router;
