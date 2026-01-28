import { Response } from 'express';
import { BlogPost } from '../models';
import { AuthRequest, AppError } from '../middleware';

export const getAllBlogPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, tag, search } = req.query;

    const query: any = { published: true };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await BlogPost.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getBlogPostBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ slug });

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (error) {
    throw error;
  }
};

export const createBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, excerpt, category, tags, author, featuredImage, published } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();

    const post = new BlogPost({
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      author,
      featuredImage,
      published: published || false,
      publishedAt: published ? new Date() : undefined,
    });

    await post.save();

    res.status(201).json({
      message: 'Blog post created successfully',
      post,
    });
  } catch (error) {
    throw error;
  }
};

export const updateBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.published && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    res.json({
      message: 'Blog post updated successfully',
      post,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const likeBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);
    if (!post) {
      throw new AppError('Blog post not found', 404);
    }

    post.likes += 1;
    await post.save();

    res.json({
      message: 'Post liked successfully',
      likes: post.likes,
    });
  } catch (error) {
    throw error;
  }
};
