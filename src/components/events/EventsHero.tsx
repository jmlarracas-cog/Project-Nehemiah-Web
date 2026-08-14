import React from 'react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { useSiteSettings } from '../../context/SiteContext';

interface EventsHeroProps {
  title: string;
  goldSubtitle?: string;
  subtitle: string;
  bgImage: string;
  imageAlt: string;
}

export const EventsHero: React.FC<EventsHeroProps> = ({
  title,
  goldSubtitle,
  subtitle,
  bgImage,
  imageAlt,
}) => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative flex items-center justify-center text-white overflow-hidden bg-navy min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] border-b border-gold/20">
      {/* Background Image Layer with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={imageAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-navy/90" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl py-12 sm:py-16 mx-auto text-center flex flex-col items-center">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Events & Gatherings' },
            ]}
          />
        </div>

        {/* Brand Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 mb-5 rounded-full bg-gold/15 border border-gold/30 backdrop-blur-md text-gold text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg">
          <img
            src={settings.brand.primaryLogo}
            alt={settings.brand.logoAltText}
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain"
          />
          <span>{goldSubtitle || 'GATHER. GROW. GO.'}</span>
        </div>

        {/* Main H1 Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4 leading-tight font-sans drop-shadow-md">
          {title}
        </h1>

        {/* Subtitle / Intro Description */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl font-normal leading-relaxed font-sans">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
