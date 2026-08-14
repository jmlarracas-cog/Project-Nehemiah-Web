import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { navigationItems, primaryCta } from '../../config/navigation';
import { useSiteSettings } from '../../context/SiteContext';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { BrandLogo } from '../ui/BrandLogo';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  currentPath: string;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onOpenSearch }) => {
  const { settings } = useSiteSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-xl border-b border-gold/20 backdrop-blur-md">
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Branding */}
          <a
            href="/"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-gold rounded-sm p-1"
            aria-label={`${settings.churchName} Home`}
          >
            <BrandLogo variant="header" showText={true} />
          </a>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-sm ${
                    isActive
                      ? 'text-gold border-b-2 border-gold font-extrabold bg-white/5'
                      : 'text-slate-200 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full text-slate-300 hover:text-gold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Open search dialog"
              title="Search website"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <Button variant="primary" size="sm" href={primaryCta.path}>
                {primaryCta.label}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={currentPath}
        onOpenSearch={onOpenSearch}
      />
    </header>
  );
};
