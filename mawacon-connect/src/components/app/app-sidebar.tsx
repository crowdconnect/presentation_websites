'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FileSignature,
  FileText,
  HardDrive,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Sparkles,
  Tv,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { user } from '@/lib/data';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/contracts', label: 'Verträge', icon: <FileSignature /> },
  { href: '/invoices', label: 'Rechnungen', icon: <FileText /> },
  { href: '/hardware', label: 'Hardware', icon: <HardDrive /> },
  { href: '/tv-packages', label: 'TV-Pakete', icon: <Tv /> },
  { href: '/referrals', label: 'Freunde werben', icon: <Users /> },
  { href: '/support', label: 'Hilfe & Support', icon: <MessageSquare /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="items-center justify-center group-data-[collapsible=icon]:hidden p-4">
        <Link href="/dashboard" onClick={handleLinkClick}>
          <Image 
            src="/mawacon-logo.png" 
            alt="Mawacon Logo"
            width={120}
            height={30}
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                size="lg"
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton
              asChild
              size="lg"
              className="justify-start"
              tooltip={{ children: user.name, side: 'right' }}
            >
              <Link href="#" onClick={handleLinkClick}>
                <Avatar className="size-8">
                    <AvatarImage src={`https://www.un.org/sites/un2.un.org/files/styles/banner-image-style-27-10/public/2025/06/horse-day-banner.pnghttps://www.zinnfigur.com/out/pictures/master/product/1/411_54893.jpghttps://www.zinnfigur.com/out/pictures/master/product/1/411_54893.jpg`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">Abmelden</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
