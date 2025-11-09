'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  FileSignature,
  FileText,
  HardDrive,
  LayoutDashboard,
  MessageSquare,
  Tv,
  Users,
} from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/contracts', label: 'Verträge', icon: <FileSignature /> },
  { href: '/invoices', label: 'Rechnungen', icon: <FileText /> },
  { href: '/hardware', label: 'Hardware', icon: <HardDrive /> },
  { href: '/tv-packages', label: 'TV-Pakete', icon: <Tv /> },
  { href: '/referrals', label: 'Freunde werben', icon: <Users /> },
  { href: '/support', label: 'Hilfe & Support', icon: <MessageSquare /> },
];

export function AppHeader() {
  const pathname = usePathname();
  const currentTitle = menuItems.find((item) => item.href === pathname)?.label || 'Mawacon Connect';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-xl">{currentTitle}</h1>
      </div>
      <div className="flex items-center">
        <Image 
          src="/mawacon-logo.png" 
          alt="Mawacon Logo"
          width={120}
          height={30}
        />
      </div>
    </header>
  );
}
