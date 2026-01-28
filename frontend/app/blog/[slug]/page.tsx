'use client';

import { BlogArticle } from '@/components/blog/BlogArticle';

const mockPost = {
  id: '1',
  title: 'The Science Behind 21-Day Habit Formation',
  slug: 'science-behind-habit-formation',
  content: `
    <p>Habit formation is a fascinating process that has been studied extensively by psychologists and neuroscientists. The popular notion that it takes 21 days to form a habit originated from a book by plastic surgeon Maxwell Maltz in the 1960s, but modern research has provided more nuanced insights.</p>

    <h2>The Origins of the 21-Day Rule</h2>
    <p>Dr. Maxwell Maltz observed that it took his patients approximately 21 days to get used to their new faces or limbs. He extended this observation to suggest that it takes about 21 days to form a new habit. While this timeframe has become popular, subsequent research has shown that habit formation can take anywhere from 18 to 254 days.</p>

    <h2>How Habits Form in the Brain</h2>
    <p>Habits are formed through a process called habituation, where repeated behaviors become automatic. The brain creates neural pathways that make these behaviors easier to perform over time. This process involves the basal ganglia, a region of the brain associated with procedural learning and routine behaviors.</p>

    <h2>The Habit Loop</h2>
    <p>Understanding the habit loop is crucial for forming new habits. The loop consists of three components:</p>
    <ul>
      <li><strong>Cue:</strong> A trigger that initiates the behavior</li>
      <li><strong>Behavior:</strong> The action you take</li>
      <li><strong>Reward:</strong> The benefit you receive from the behavior</li>
    </ul>

    <h2>Strategies for Successful Habit Formation</h2>
    <p>Here are some evidence-based strategies to help you form lasting habits:</p>

    <h3>1. Start Small</h3>
    <p>Begin with tiny habits that are easy to accomplish. This builds momentum and confidence.</p>

    <h3>2. Be Consistent</h3>
    <p>Perform the habit at the same time and in the same context whenever possible.</p>

    <h3>3>Track Your Progress</h3>
    <p>Use a habit tracker to monitor your consistency and celebrate small wins.</p>

    <h3>4.Design Your Environment</h3>
    <p>Make good habits easy and bad habits difficult by adjusting your environment.</p>

    <h2>Conclusion</h2>
    <p>While 21 days might not be the magic number for everyone, it serves as an excellent framework for initiating change. The key is consistency and patience. Focus on building one habit at a time, and don't be discouraged by setbacks. With time and practice, you can transform your life one habit at a time.</p>
  `,
  category: 'Personal Growth',
  author: 'Dr. Sarah Johnson',
  publishedAt: '2024-01-15',
  image: '/api/placeholder/1200/600',
  tags: ['habits', 'psychology', 'science', 'self-improvement'],
};

const relatedPosts = [
  { id: '2', title: '10 Morning Routines That Will Transform Your Life', slug: 'morning-routines-transform-life' },
  { id: '3', title: 'Overcoming Procrastination: A Step-by-Step Guide', slug: 'overcoming-procrastination' },
  { id: '4', title: 'The Power of Mindfulness in Daily Life', slug: 'power-of-mindfulness' },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-6 lg:p-8">
      <BlogArticle post={mockPost} relatedPosts={relatedPosts} />
    </div>
  );
}
