'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags?: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-background-200 hover:shadow-md transition-shadow"
    >
      {post.image && (
        <div className="aspect-video overflow-hidden relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            {post.category}
          </span>
          <span className="text-text-500 text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-text-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-text-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-sm font-medium">
                {post.author.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-text-600">{post.author}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm group"
          >
            Read More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-background-200">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-text-500 bg-background-100 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
