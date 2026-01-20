'use client';

import './globals.css';

import { AuthProvider } from '@/hooks/useAuth';
import { ProgramProvider } from '@/hooks/useProgram';
import { ProgressProvider } from '@/hooks/useProgress';
import { AdminProvider } from '@/hooks/useAdmin';
import { ToastProvider } from '@/components/shared/Toast';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ProgramProvider>
              <ProgressProvider>
                <AdminProvider>
                  <ToastProvider>
                    <Navbar />
                    <div className="pt-16 flex">
                      <Sidebar />
                      <main className="flex-1 lg:ml-64 min-h-screen bg-background-50">
                        {children}
                      </main>
                    </div>
                  </ToastProvider>
                </AdminProvider>
              </ProgressProvider>
            </ProgramProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
