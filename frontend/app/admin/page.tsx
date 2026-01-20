'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserTable } from '@/components/admin/UserTable';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { BlogActions } from '@/components/admin/ActionButtons';
import { useAdmin } from '@/hooks/useAdmin';
import { Users, FileText, Settings, Plus, Download } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Modal } from '@/components/shared/Modal';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { toast } from '@/components/shared/Toast';

export default function AdminPage() {
  const {
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
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'settings'>('overview');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchBlogPosts();
  }, [fetchStats, fetchUsers, fetchBlogPosts]);

  const handleCreatePost = async (data: any) => {
    try {
      await createBlogPost(data);
      setIsContentModalOpen(false);
      toast.success('Blog yazısı başarıyla oluşturuldu');
    } catch (error) {
      toast.error('Blog yazısı oluşturulamadı');
    }
  };

  const handleUpdatePost = async (data: any) => {
    if (!editingPost) return;
    try {
      await updateBlogPost(editingPost.id, data);
      setEditingPost(null);
      setIsContentModalOpen(false);
      toast.success('Blog yazısı başarıyla güncellendi');
    } catch (error) {
      toast.error('Blog yazısı güncellenemedi');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteBlogPost(postId);
      toast.success('Blog yazısı başarıyla silindi');
    } catch (error) {
      toast.error('Blog yazısı silinemedi');
    }
  };

  const handleEditPost = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setIsContentModalOpen(true);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success('Kullanıcı başarıyla silindi');
    } catch (error) {
      toast.error('Kullanıcı silinemedi');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: <Users className="w-4 h-4" /> },
    { id: 'users', label: 'Kullanıcılar', icon: <Users className="w-4 h-4" /> },
    { id: 'content', label: 'İçerik', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-900 mb-2">Yönetici Paneli</h1>
          <p className="text-text-600">Kullanıcıları, içeriği ve platform ayarlarını yönetin</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-background-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-text-600 hover:text-text-900'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <StatsOverview stats={stats} />
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <ActionButtons
                actions={[
                  { label: 'Kullanıcı Ekle', icon: Plus, onClick: () => { } },
                  { label: 'Kullanıcıları Dışa Aktar', icon: Download, onClick: () => { } },
                ]}
              />
            </div>
            <UserTable
              users={users}
              loading={loading}
              onEdit={(user) => { }}
              onDelete={handleDeleteUser}
            />
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="mb-6">
              <Button onClick={() => {
                setEditingPost(null);
                setIsContentModalOpen(true);
              }} leftIcon={<Plus className="w-4 h-4" />}>
                Yeni Yazı Oluştur
              </Button>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg p-6 border border-background-200 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-900 mb-2">{post.title}</h3>
                    <p className="text-text-600 text-sm mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-text-500">
                      <span>{post.category}</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <BlogActions
                    postId={post.id}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-6 border border-background-200">
            <h2 className="text-2xl font-semibold text-text-900 mb-6">Platform Ayarları</h2>
            <p className="text-text-600">Ayarlar paneli içeriği burada</p>
          </div>
        )}

        <Modal
          isOpen={isContentModalOpen}
          onClose={() => setIsContentModalOpen(false)}
          title={editingPost ? 'Yazıyı Düzenle' : 'Yazı Oluştur'}
          size="xl"
        >
          <ContentEditor
            initialData={editingPost || undefined}
            onSave={editingPost ? handleUpdatePost : handleCreatePost}
            onCancel={() => setIsContentModalOpen(false)}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
