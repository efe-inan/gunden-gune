import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    author: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Slug index is created by unique: true option above
blogPostSchema.index({ published: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
