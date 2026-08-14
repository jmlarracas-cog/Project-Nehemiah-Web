import React, { useEffect, useRef } from 'react';
import { X, Search, MapPin, Phone, ChevronRight } from 'lucide-react';
import { navigationItems, primaryCta } from '../../config/navigation';
import { useSiteSettings } from '../../context/SiteContext';
import { Button } from '../ui/Button';
import { BrandLogo } from '../ui/BrandLogo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPath,
  onOpenSearch,
}) => {
  const { settings } = useSiteSettings();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Auto focus close button on open for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden overflow-hidden"
      aria-modal="true"
      role="dialog"
      id="mobile-nav-drawer"
      aria-label="Navigation Menu"
    >
      {/* Translucent Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Off-Canvas Drawer (Slide from Right) */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-[85vw] max-w-[340px] h-[100dvh] bg-navy text-white shadow-2xl border-l border-gold/30 flex flex-col justify-between p-5 sm:p-6 overflow-y-auto transform transition-transform duration-300 ease-out translate-x-0"
      >
        {/* Drawer Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <BrandLogo variant="header" showText={true} onClick={onClose} />
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Search Trigger */}
          <div className="pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-colors text-xs font-semibold border border-white/10"
            >
              <span className="flex items-center">
                <Search className="w-4 h-4 mr-2 text-gold" /> Search website...
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded">⌘K</kbd>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="py-2 space-y-1" aria-label="Mobile Site Navigation">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-gold text-navy font-black shadow-md'
                      : 'text-slate-200 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <div className="w-2 h-2 rounded-full bg-navy" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-60" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer CTA & Contact */}
        <div className="pt-5 border-t border-white/10 space-y-4">
          <Button
            variant="primary"
            size="lg"
            href={primaryCta.path}
            className="w-full text-center py-3 justify-center shadow-lg font-black tracking-wider"
            onClick={onClose}
          >
            {primaryCta.label}
          </Button>

          <div className="space-y-2 text-[11px] sm:text-xs text-slate-300 pt-1">
            <div className="flex items-start">
              <MapPin className="w-3.5 h-3.5 mr-2 text-gold shrink-0 mt-0.5" />
              <span className="line-clamp-2">{settings.contact.address}</span>
            </div>
            {settings.contact.phone && (
              <div className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-gold shrink-0" />
                <span>{settings.contact.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
