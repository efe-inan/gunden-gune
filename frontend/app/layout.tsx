import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar } from '@/components/navigation/Sidebar';

export const metadata = {
  title: 'Günden Güne',
  description: 'Kişisel Gelişim Platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <Providers>
          <Navbar />
          <div className="pt-16 flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-background-50 via-white to-primary-50/30">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
