import React from 'react';
import { useSiteSettings } from '../../context/SiteContext';

export interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'hero' | 'compact' | 'full' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  logoClassName?: string;
  altText?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  size,
  showText = true,
  className = '',
  logoClassName = '',
  altText,
  onClick,
}) => {
  const { settings } = useSiteSettings();
  const brand = settings.brand;

  const logoSrc = brand.primaryLogo || '/assets/brand/subic-cog-brand-logo.png';
  const logoAlt = altText || brand.logoAltText || 'Church of God – Subic official logo';

  // Responsive design token sizes
  const sizeClasses: Record<string, string> = {
    header: 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16',
    footer: 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24',
    hero: 'h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40',
    compact: 'h-10 w-10',
    full: 'h-32 w-32 sm:h-48 sm:w-48 lg:h-56 lg:w-56',
    light: 'h-12 w-12 sm:h-14 sm:w-14',
    dark: 'h-12 w-12 sm:h-14 sm:w-14',
    sm: 'h-10 w-10',
    md: 'h-14 w-14 sm:h-16 sm:w-16',
    lg: 'h-20 w-20 sm:h-24 sm:w-24',
    xl: 'h-32 w-32 sm:h-40 sm:w-40',
  };

  const containerSizes = size ? sizeClasses[size] : (sizeClasses[variant] || sizeClasses.header);

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-3 group cursor-pointer select-none ${className}`}
    >
      {/* Official Brand Logo Image Container */}
      <div
        className={`relative shrink-0 flex items-center justify-center p-1 transition-transform duration-200 group-hover:scale-105 ${containerSizes}`}
      >
        <img
          src={logoSrc}
          alt={logoAlt}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-contain filter drop-shadow-md transition-all ${logoClassName}`}
        />
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-base sm:text-lg font-black uppercase tracking-tight text-white group-hover:text-gold transition-colors leading-tight font-sans">
            {settings.churchName}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gold uppercase tracking-widest leading-none mt-0.5">
            {settings.tagline}
          </span>
        </div>
      )}
    </div>
  );
};
