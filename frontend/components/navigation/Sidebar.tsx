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
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-background-200 overflow-y-auto hidden lg:block">
      <div className="p-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-text-600 hover:bg-background-100'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
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
