'use client';

import { WalletConnect } from './WalletConnect';
import { Search, Bell, Menu, X, LayoutDashboard, TrendingUp, Target, Wallet, BarChart3 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { useSearch } from '@/hooks/useSearch';

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { query, setQuery, results, loading } = useSearch();

  const mobileNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Tokens', href: '/discover', icon: TrendingUp },
    { name: 'Campaigns', href: '/campaigns', icon: Target },
    { name: 'Wallets', href: '/wallets', icon: Wallet },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
      setSearchFocused(false);
    }
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 gap-3">
        
        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="flex-1 max-w-xl" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search tokens, campaigns..." 
              className="bg-card w-full pl-11 pr-4 py-2.5 rounded-full border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />

            {/* Live search dropdown */}
            {searchFocused && query.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
                {loading ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    <div className="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                    Searching…
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto">
                    {results.map((r) => (
                      <button
                        key={r.contractId}
                        type="button"
                        onClick={() => {
                          router.push(`/token/${r.contractId}`);
                          setSearchFocused(false);
                          setQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-border/30 last:border-0"
                      >
                        {r.imageUri ? (
                          <img src={r.imageUri} alt={r.name} className="w-8 h-8 rounded-full object-cover bg-muted" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                            {r.symbol?.slice(0, 2)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{r.name}</span>
                            <span className="text-xs text-muted-foreground">{r.symbol}</span>
                          </div>
                          {r.price > 0 && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">${r.price.toFixed(6)}</span>
                              <span className={`text-xs font-medium ${r.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {r.priceChange24h >= 0 ? '+' : ''}{r.priceChange24h.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        
        <div className="flex items-center gap-6 ml-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground tracking-wide font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            Live Data
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5 rounded-full"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/20">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (!n.read) markAsRead(n.id);
                          if (n.link) router.push(n.link);
                          setShowNotifications(false);
                        }}
                        className={`flex flex-col px-4 py-3 gap-1 border-b border-border/50 transition-colors cursor-pointer ${n.read ? 'bg-transparent hover:bg-white-[0.02]' : 'bg-primary/5 hover:bg-primary/10'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{n.title}</span>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <WalletConnect />
        </div>

      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute top-20 left-0 w-64 bg-background border-r border-border h-[calc(100vh-5rem)] p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-card text-foreground border border-border'
                      : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
