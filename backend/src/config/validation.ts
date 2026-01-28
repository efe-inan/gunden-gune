import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(13, 'Age must be at least 13').max(120, 'Age must be less than 120'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  dailyTimeCommitment: z.number().min(15, 'Minimum 15 minutes').max(180, 'Maximum 180 minutes'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  developmentAreas: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().min(13).max(120).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  dailyTimeCommitment: z.number().min(15).max(180).optional(),
  interests: z.array(z.string()).optional(),
});

export const testSubmissionSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.number(),
  })),
});

export const createProgramSchema = z.object({
  developmentAreaId: z.string(),
  testResultId: z.string(),
});

export const updateProgressSchema = z.object({
  completedTaskIds: z.array(z.string()),
  reflection: z.string().optional(),
});

export const reflectionSchema = z.object({
  reflection: z.string().min(10, 'Reflection must be at least 10 characters'),
});

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  excerpt: z.string().min(50, 'Excerpt must be at least 50 characters'),
  category: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  featuredImage: z.string().optional(),
  published: z.boolean().optional(),
});

export const updateBlogPostSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(100).optional(),
  excerpt: z.string().min(50).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().optional(),
});

export const developmentAreaSchema = z.object({
  name: z.string().min(2),
  slug: z.string(),
  description: z.string().min(10),
  icon: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
  })),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type TestSubmissionInput = z.infer<typeof testSubmissionSchema>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type ReflectionInput = z.infer<typeof reflectionSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type DevelopmentAreaInput = z.infer<typeof developmentAreaSchema>;
