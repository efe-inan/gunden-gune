'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Share2, Bookmark } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { Button } from '@/design-system/components/Button';

interface BlogArticleProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    author: string;
    publishedAt: string;
    image?: string;
    tags?: string[];
  };
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

export function BlogArticle({ post, relatedPosts = [] }: BlogArticleProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Blog&apos;a Dön
      </Link>

      {post.image && (
        <div className="aspect-video overflow-hidden rounded-xl mb-8 relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
          {post.category}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-text-900 mb-6">{post.title}</h1>

      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-background-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-900">{post.author}</p>
            <p className="text-sm text-text-500">Yazar</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-500 text-sm">
          <Calendar className="w-4 h-4" />
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none text-text-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-background-200">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-background-100 text-text-600 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-background-200">
          <h2 className="text-2xl font-bold text-text-900 mb-6">İlgili Yazılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="p-4 border border-background-200 rounded-lg hover:border-primary-300 hover:bg-background-50 transition-all"
              >
                <h3 className="font-medium text-text-900 mb-2 line-clamp-2">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
