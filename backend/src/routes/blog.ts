import { Router } from 'express';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
} from '../controllers/blogController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { blogPostSchema, updateBlogPostSchema } from '../config/validation';

const router = Router();

router.get('/', asyncHandler(getAllBlogPosts));
router.get('/:slug', asyncHandler(getBlogPostBySlug));
router.post('/', authenticate, validateBody(blogPostSchema), asyncHandler(createBlogPost));
router.put('/:id', authenticate, validateBody(updateBlogPostSchema), asyncHandler(updateBlogPost));
router.delete('/:id', authenticate, asyncHandler(deleteBlogPost));
router.post('/:id/like', asyncHandler(likeBlogPost));

export default router;
