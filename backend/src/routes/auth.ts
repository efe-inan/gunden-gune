import { Router } from 'express';
import { register, login, logout, refreshToken, getMe } from '../controllers/authController';
import { authenticate, authRateLimiter } from '../middleware';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { registerSchema, loginSchema } from '../config/validation';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), asyncHandler(register));
router.post('/login', authRateLimiter, validateBody(loginSchema), asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh-token', asyncHandler(refreshToken));
router.get('/me', authenticate, asyncHandler(getMe));

export default router;
