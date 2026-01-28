'use client';

import { useState, useMemo } from 'react';
import { BlogCard } from './BlogCard';
import { Search, Filter } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { Button } from '@/design-system/components/Button';

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

interface BlogListProps {
  posts: BlogPost[];
  categories: string[];
}

export function BlogList({ posts, categories }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(lowerSearchQuery) ||
        post.excerpt.toLowerCase().includes(lowerSearchQuery);
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={selectedCategory === 'All' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-500 text-lg">No articles found</p>
          <p className="text-text-400">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
