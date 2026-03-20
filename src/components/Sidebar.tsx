'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Target, Wallet, BarChart3 } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Tokens', href: '/discover', icon: TrendingUp },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'Wallets', href: '/wallets', icon: Wallet },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="group flex flex-col w-[80px] hover:w-[260px] transition-all duration-300 ease-in-out border-r border-border bg-background h-full overflow-x-hidden overflow-y-auto shrink-0 z-20">
      <div className="h-20 flex items-center px-[22px] shrink-0">
        <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80 whitespace-nowrap overflow-hidden">
          <Image src="/logo.svg" alt="Stacks Memer Logo" width={36} height={36} className="rounded-full shadow-lg shadow-orange-500/20 shrink-0" />
          <span className="text-lg font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Stacks Memer
          </span>
        </Link>
      </div>

      <div className="px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-3.5 py-3 text-sm font-medium transition-all whitespace-nowrap overflow-hidden ${
                isActive 
                  ? 'bg-card text-foreground border border-border shadow-sm' 
                  : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
