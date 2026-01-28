'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/design-system/components/Button';
import { toast } from '@/components/shared/Toast';
import { colors } from '@/design-system/colors';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(1, 'Author is required'),
  imageUrl: z.string().optional(),
  tags: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface ContentEditorProps {
  initialData?: Partial<BlogPostFormData>;
  onSave: (data: BlogPostFormData) => Promise<void>;
  onCancel?: () => void;
}

export function ContentEditor({ initialData, onSave, onCancel }: ContentEditorProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema as any),
    defaultValues: initialData,
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setLoading(true);
    try {
      await onSave(data);
      toast.success('Content saved successfully!');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Personal Growth', 'Motivation', 'Productivity', 'Health', 'Relationships'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-700 mb-2">Title</label>
          <input
            {...register('title')}
            className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Article title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-700 mb-2">Slug</label>
          <input
            {...register('slug')}
            className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="article-slug"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-error-600">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-700 mb-2">Category</label>
        <select
          {...register('category')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-700 mb-2">Excerpt</label>
        <textarea
          {...register('excerpt')}
          rows={3}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Brief description of the article..."
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-error-600">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-700 mb-2">Content</label>
        <textarea
          {...register('content')}
          rows={12}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Write your article content..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-error-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-700 mb-2">Image URL</label>
        <input
          {...register('imageUrl')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-700 mb-2">Tags (comma-separated)</label>
        <input
          {...register('tags')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-700 mb-2">Author</label>
        <input
          {...register('author')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Author name"
        />
        {errors.author && (
          <p className="mt-1 text-sm text-error-600">{errors.author.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          Save Content
        </Button>
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
