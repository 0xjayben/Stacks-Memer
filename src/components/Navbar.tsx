'use client';

import { WalletConnect } from './WalletConnect';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-20 items-center justify-between px-6">
        
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tokens, campaigns..." 
              className="bg-card w-full pl-11 pr-4 py-2.5 rounded-full border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />
          </form>
        </div>
        
        <div className="flex items-center gap-6 ml-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground tracking-wide font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            Live Data
          </div>
          <WalletConnect />
        </div>

      </div>
    </nav>
  );
}
