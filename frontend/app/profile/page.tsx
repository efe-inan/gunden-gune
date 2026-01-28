'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/design-system/components/Button';
import { toast } from '@/components/shared/Toast';
import { User, Mail, MapPin, Save, Bell, Shield, Palette } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçersiz e-posta adresi'),
  bio: z.string().optional(),
  location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { updateUserPreferences } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'preferences'>('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema as any),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  const handleProfileSave = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success('Profil başarıyla güncellendi');
    } catch (error) {
      toast.error('Profil güncellenemedi');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'account', label: 'Hesap', icon: Shield },
    { id: 'preferences', label: 'Tercihler', icon: Palette },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-900 mb-2">Profil</h1>
          <p className="text-text-600">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
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
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-2xl">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-background-200">
              <h2 className="text-2xl font-semibold text-text-900 mb-6">Kişisel Bilgiler</h2>

              <form onSubmit={handleSubmit(handleProfileSave)} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Fotoğrafı Değiştir
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    E-posta
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    Biyografi
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Bize kendinizden bahsedin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    Konum
                  </label>
                  <input
                    {...register('location')}
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Şehir, Ülke"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-background-200">
              <h2 className="text-2xl font-semibold text-text-900 mb-6">Hesap Ayarları</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">
                    Yeni Şifreyi Onayla
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="pt-4 border-t border-background-200">
                  <h3 className="text-lg font-semibold text-text-900 mb-4">Hesabı Sil</h3>
                  <p className="text-text-600 mb-4">
                    Hesabınızı sildiğinizde geri dönüşü yoktur. Lütfen emin olun.
                  </p>
                  <Button variant="outline" className="text-error-600 border-error-300 hover:bg-error-50">
                    Hesabı Sil
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-background-200">
              <h2 className="text-2xl font-semibold text-text-900 mb-6">Tercihler</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text-900">E-posta Bildirimleri</h3>
                    <p className="text-sm text-text-500">Günlük hatırlatıcılar ve ilerleme güncellemeleri alın</p>
                  </div>
                  <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text-900">Haftalık Özet</h3>
                    <p className="text-sm text-text-500">E-posta ile haftalık ilerleme özeti alın</p>
                  </div>
                  <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text-900">Topluluk Güncellemeleri</h3>
                    <p className="text-sm text-text-500">Topluluk aktivitelerinden haberdar olun</p>
                  </div>
                  <button className="w-12 h-6 bg-background-300 rounded-full relative">
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="pt-4 border-t border-background-200">
                  <h3 className="font-medium text-text-900 mb-4">Tema</h3>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg border-2 border-primary-500">
                      Açık
                    </button>
                    <button className="px-4 py-2 bg-text-900 text-white rounded-lg border-2 border-transparent">
                      Koyu
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-text-900 to-white text-white rounded-lg border-2 border-transparent">
                      Sistem
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
