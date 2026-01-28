'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags?: string[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  currentDay: number;
  streak: number;
  isOnboarded: boolean;
  joinedAt?: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPrograms: number;
  completionRate: number;
}

interface AdminContextType {
  users: UserData[];
  blogPosts: BlogPost[];
  stats: Stats;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  fetchBlogPosts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createBlogPost: (post: Partial<BlogPost>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<UserData>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPrograms: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // const data = await api.get('/admin/users');
      setUsers([
        { id: '1', name: 'Test User', email: 'test@example.com', currentDay: 5, streak: 3, isOnboarded: true, joinedAt: new Date().toISOString() }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      // const data = await api.get('/admin/blog');
      setBlogPosts([
        { id: '1', title: 'Merhaba Dünya', slug: 'merhaba-dunya', excerpt: 'İlk yazı', content: 'İçerik', category: 'Genel', author: 'Admin', publishedAt: new Date().toISOString() }
      ]);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // const data = await api.get('/admin/stats');
      setStats({
        totalUsers: 1,
        activeUsers: 1,
        totalPrograms: 1,
        completionRate: 100,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const createBlogPost = async (post: Partial<BlogPost>) => {
    // const newPost = await api.post('/admin/blog', post);
    // setBlogPosts([...blogPosts, newPost]);
    console.log('Create post mock', post);
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    // const updatedPost = await api.put(`/admin/blog/${id}`, post);
    // setBlogPosts(blogPosts.map(p => p.id === id ? updatedPost : p));
    console.log('Update post mock', id, post);
  };

  const deleteBlogPost = async (id: string) => {
    // await api.delete(`/admin/blog/${id}`);
    setBlogPosts(blogPosts.filter(p => p.id !== id));
  };

  const updateUser = async (id: string, data: Partial<UserData>) => {
    // const updatedUser = await api.put(`/admin/users/${id}`, data);
    // setUsers(users.map(u => u.id === id ? updatedUser : u));
    console.log('Update user mock', id, data);
  };

  const deleteUser = async (id: string) => {
    // await api.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        blogPosts,
        stats,
        loading,
        fetchUsers,
        fetchBlogPosts,
        fetchStats,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
