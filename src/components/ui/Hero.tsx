import React from 'react';
import { Button } from './Button';
import { useSiteSettings } from '../../context/SiteContext';

interface HeroProps {
  title: string;
  goldSubtitle?: string;
  highlight?: string;
  description?: string;
  bgImage?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  overlayOpacity?: number;
  height?: 'full' | 'large' | 'medium';
  id?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  goldSubtitle,
  highlight,
  description,
  bgImage = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000',
  primaryCtaLabel = 'PLAN YOUR VISIT',
  primaryCtaHref = '/visit',
  secondaryCtaLabel = 'WATCH SERMONS',
  secondaryCtaHref = '/sermons',
  height = 'large',
  id,
}) => {
  const { settings } = useSiteSettings();

  return (
    <section
      id={id}
      className="relative flex items-center justify-center text-white overflow-hidden bg-navy min-h-[650px] sm:min-h-[680px] lg:min-h-[720px] max-h-[850px]"
    >
      {/* Background Image Layer - High clarity, subtle zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 filter brightness-[0.85] contrast-[1.05]"
        style={{ backgroundImage: `url("${bgImage}")` }}
      />

      {/* Cinematic Dark Navy Directional Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/80 to-navy-dark/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-navy-dark/60" />

      {/* Cinematic Lighting Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl py-16 sm:py-20 mx-auto text-center md:text-left flex flex-col items-center md:items-start">
        {/* Church Eyebrow */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 mb-6 rounded-full bg-gold/15 border border-gold/30 backdrop-blur-md text-gold text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg">
          <img
            src={settings.brand.primaryLogo}
            alt={settings.brand.logoAltText}
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain"
          />
          <span>Church of God Subic</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-lg mb-3 sm:mb-4">
          {title}
        </h1>

        {/* Gold Accent Supporting Line */}
        {(goldSubtitle || highlight) && (
          <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold uppercase tracking-wider text-gold mb-6 sm:mb-8 drop-shadow-sm text-balance">
            {goldSubtitle || highlight}
          </div>
        )}

        {/* Paragraph Description */}
        {description && (
          <p className="text-base sm:text-lg lg:text-xl font-light text-slate-100 max-w-3xl mb-8 sm:mb-10 leading-relaxed drop-shadow-xs text-balance">
            {description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start items-stretch sm:items-center">
          {primaryCtaLabel && (
            <Button variant="primary" size="lg" href={primaryCtaHref} className="w-full sm:w-auto justify-center">
              {primaryCtaLabel}
            </Button>
          )}
          {secondaryCtaLabel && (
            <Button variant="outline" size="lg" href={secondaryCtaHref} className="w-full sm:w-auto justify-center">
              {secondaryCtaLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Subtle Transition Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

