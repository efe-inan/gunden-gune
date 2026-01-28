'use client';

import { useState, useEffect } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPage() {
  const categories = ['Tümü', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-900 mb-4">Blog</h1>
          <p className="text-lg text-text-600">
            Kişisel gelişim yolculuğunuzu destekleyecek ipuçları, içgörüler ve hikayeler keşfedin
          </p>
        </div>

        <BlogList posts={blogPosts} categories={categories} />
      </div>
    </div>
  );
}
