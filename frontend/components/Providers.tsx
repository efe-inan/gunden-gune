'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ProgramProvider } from '@/hooks/useProgram';
import { ProgressProvider } from '@/hooks/useProgress';
import { AdminProvider } from '@/hooks/useAdmin';
import { ToastProvider } from '@/components/shared/Toast';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgramProvider>
          <ProgressProvider>
            <AdminProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AdminProvider>
          </ProgressProvider>
        </ProgramProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
