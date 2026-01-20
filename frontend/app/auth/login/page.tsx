'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-50 px-4">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-text-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-text-900 mb-2">Tekrar Hoş Geldiniz</h1>
          <p className="text-text-600 mb-8">Dönüşüm yolculuğunuza devam etmek için giriş yapın</p>

          <LoginForm />

          <p className="mt-6 text-center text-text-600">
            Hesabınız yok mu?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
