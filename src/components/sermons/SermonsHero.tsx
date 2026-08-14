import React from 'react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { useSiteSettings } from '../../context/SiteContext';

interface SermonsHeroProps {
  title: string;
  goldSubtitle?: string;
  subtitle: string;
  bgImage: string;
  imageAlt: string;
  scriptureQuote?: {
    text: string;
    reference: string;
  };
}

export const SermonsHero: React.FC<SermonsHeroProps> = ({
  title,
  goldSubtitle,
  subtitle,
  bgImage,
  imageAlt,
  scriptureQuote,
}) => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative flex items-center justify-center text-white overflow-hidden bg-navy min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] border-b border-gold/20">
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
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl py-14 sm:py-18 mx-auto text-center flex flex-col items-center">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Sermons & Teachings' },
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
          <span>{goldSubtitle || 'THE WORD OF GOD FOR EVERY SEASON'}</span>
        </div>

        {/* Main H1 Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4 leading-tight font-sans drop-shadow-md">
          {title}
        </h1>

        {/* Subtitle / Intro Description */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl font-normal leading-relaxed mb-8">
          {subtitle}
        </p>

        {/* Optional Scripture Quote Banner */}
        {scriptureQuote && (
          <div className="max-w-2xl bg-navy-light/70 border border-gold/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm text-center shadow-xl">
            <p className="text-sm sm:text-base italic text-slate-200 font-serif leading-relaxed mb-2">
              "{scriptureQuote.text}"
            </p>
            <span className="text-xs sm:text-sm font-bold text-gold uppercase tracking-widest">
              — {scriptureQuote.reference}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
