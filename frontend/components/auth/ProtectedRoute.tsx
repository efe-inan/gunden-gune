'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/shared/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (requireAdmin && !user.isAdmin) {
        router.push('/dashboard'); // or /unauthorized
      }
    }
  }, [user, loading, router, requireAdmin]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
