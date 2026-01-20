'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/design-system/components/Button';
import { toast } from '@/components/shared/Toast';
import { colors } from '@/design-system/colors';

import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçersiz e-posta adresi'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string().min(6, 'Lütfen şifrenizi onaylayın'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as any),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Hesap başarıyla oluşturuldu!');
      router.push('/onboarding');
    } catch (error) {
      toast.error('Hesap oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-700 mb-2">
          Ad Soyad
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
          placeholder="Ahmet Yılmaz"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-700 mb-2">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
          placeholder="ahmet@ornek.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-700 mb-2">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-700 mb-2">
          Şifreyi Onayla
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="w-full px-4 py-3 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-900"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Hesap Oluştur
      </Button>
    </form>
  );
}
