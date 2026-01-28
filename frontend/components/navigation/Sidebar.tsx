'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  TrendingUp,
  User,
  Calendar,
  Target,
  FileText,
  Settings
} from 'lucide-react';
import { colors } from '@/design-system/colors';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export function Sidebar() {
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    { name: 'Kontrol Paneli', href: '/dashboard', icon: Home },
    { name: 'Program', href: '/program', icon: BookOpen },
    { name: 'İlerleme', href: '/progress', icon: TrendingUp },
    { name: 'Takvim', href: '/calendar', icon: Calendar },
    { name: 'Hedefler', href: '/goals', icon: Target },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-background-200 overflow-y-auto hidden lg:block z-40">
      <div className="p-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className="block"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${active
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-text-600 hover:bg-white hover:shadow-md hover:text-primary-600'
                    }`}
                >
                  {/* Active Indicator Line */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                  )}

                  <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-background-200">
          <Link
            href="/blog"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-600 hover:bg-background-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Blog</span>
          </Link>
          <Link
            href="/profile/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-600 hover:bg-background-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Ayarlar</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
