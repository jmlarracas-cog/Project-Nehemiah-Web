import React from 'react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { useSiteSettings } from '../../context/SiteContext';

interface AboutHeroProps {
  title: string;
  goldSubtitle?: string;
  subtitle: string;
  bgImage: string;
  imageAlt?: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({
  title,
  goldSubtitle,
  subtitle,
  bgImage,
  imageAlt = 'Church of God Subic',
}) => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative flex items-center justify-center text-white overflow-hidden bg-navy min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] max-h-[750px] border-b border-gold/20">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 filter brightness-[0.85] contrast-[1.05]"
        style={{ backgroundImage: `url("${bgImage}")` }}
        aria-label={imageAlt}
      />

      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/85 to-navy-dark/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-navy-dark/50" />

      {/* Subtle Gold Lighting Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* Hero Content Layer */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl py-12 sm:py-16 mx-auto w-full text-center md:text-left">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex justify-center md:justify-start">
          <Breadcrumb items={[{ label: 'About Our Church' }]} />
        </div>

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 mb-5 rounded-full bg-gold/15 border border-gold/30 backdrop-blur-md text-gold text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg">
          <img
            src={settings.brand.primaryLogo}
            alt={settings.brand.logoAltText}
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain"
          />
          <span>Church of God Subic</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md mb-3 sm:mb-4">
          {title}
        </h1>

        {/* Gold Accent Subtitle */}
        {goldSubtitle && (
          <div className="text-sm sm:text-lg md:text-xl font-extrabold uppercase tracking-wider text-gold mb-5 drop-shadow-xs">
            {goldSubtitle}
          </div>
        )}

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg font-light text-slate-200 max-w-3xl leading-relaxed drop-shadow-xs text-balance">
          {subtitle}
        </p>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
