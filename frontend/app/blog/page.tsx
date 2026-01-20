'use client';

import { useState, useEffect } from 'react';
import { BlogList } from '@/components/blog/BlogList';

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

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Science Behind 21-Day Habit Formation',
    slug: 'science-behind-habit-formation',
    excerpt: 'Discover why 21 days is the magic number for building lasting habits and the psychology behind habit formation.',
    category: 'Personal Growth',
    author: 'Dr. Sarah Johnson',
    publishedAt: '2024-01-15',
    image: '/api/placeholder/400/300',
    tags: ['habits', 'psychology', 'science'],
  },
  {
    id: '2',
    title: '10 Morning Routines That Will Transform Your Life',
    slug: 'morning-routines-transform-life',
    excerpt: 'Start your day right with these proven morning routines used by successful people around the world.',
    category: 'Productivity',
    author: 'Michael Chen',
    publishedAt: '2024-01-12',
    image: '/api/placeholder/400/300',
    tags: ['morning', 'productivity', 'routines'],
  },
  {
    id: '3',
    title: 'Overcoming Procrastination: A Step-by-Step Guide',
    slug: 'overcoming-procrastination',
    excerpt: 'Learn practical strategies to overcome procrastination and take control of your productivity.',
    category: 'Productivity',
    author: 'Emily Rodriguez',
    publishedAt: '2024-01-10',
    image: '/api/placeholder/400/300',
    tags: ['procrastination', 'productivity', 'self-improvement'],
  },
  {
    id: '4',
    title: 'The Power of Mindfulness in Daily Life',
    slug: 'power-of-mindfulness',
    excerpt: 'Discover how incorporating mindfulness into your daily routine can reduce stress and increase happiness.',
    category: 'Health',
    author: 'Dr. James Wilson',
    publishedAt: '2024-01-08',
    image: '/api/placeholder/400/300',
    tags: ['mindfulness', 'meditation', 'wellness'],
  },
  {
    id: '5',
    title: 'Building Stronger Relationships Through Communication',
    slug: 'building-stronger-relationships',
    excerpt: 'Master the art of effective communication to build deeper connections with those around you.',
    category: 'Relationships',
    author: 'Sarah Thompson',
    publishedAt: '2024-01-05',
    image: '/api/placeholder/400/300',
    tags: ['relationships', 'communication', 'social'],
  },
  {
    id: '6',
    title: 'Financial Habits for Long-Term Success',
    slug: 'financial-habits-success',
    excerpt: 'Develop smart financial habits that will set you up for long-term prosperity and security.',
    category: 'Financial Growth',
    author: 'David Martinez',
    publishedAt: '2024-01-02',
    image: '/api/placeholder/400/300',
    tags: ['finance', 'money', 'success'],
  },
];

export default function BlogPage() {
  const categories = ['Tümü', ...Array.from(new Set(mockPosts.map(post => post.category)))];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-900 mb-4">Blog</h1>
          <p className="text-lg text-text-600">
            Kişisel gelişim yolculuğunuzu destekleyecek ipuçları, içgörüler ve hikayeler keşfedin
          </p>
        </div>

        <BlogList posts={mockPosts} categories={categories} />
      </div>
    </div>
  );
}
