import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LeadershipPreviewBanner } from './LeadershipPreviewBanner';
import { SearchOverlay } from '../search/SearchOverlay';

interface AppShellProps {
  children: React.ReactNode;
  currentPath: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, currentPath }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 font-sans selection:bg-gold selection:text-navy">
      <LeadershipPreviewBanner />
      <Header currentPath={currentPath} onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 w-full">{children}</main>

      <Footer />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
        id="appshell-global-search"
      />
    </div>
  );
};
