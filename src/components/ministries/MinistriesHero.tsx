import React from 'react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Sparkles } from 'lucide-react';

interface MinistriesHeroProps {
  title: string;
  subtitle: string;
  bgImage: string;
  imageAlt?: string;
}

export const MinistriesHero: React.FC<MinistriesHeroProps> = ({
  title,
  subtitle,
  bgImage,
  imageAlt = 'Church of God Subic worship gathering',
}) => {
  return (
    <section className="relative bg-navy text-white min-h-[380px] sm:min-h-[460px] flex items-center pt-24 pb-16 overflow-hidden border-b border-gold/30">
      {/* Background Image with Dark Gradient Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={imageAlt}
          className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'MINISTRIES' }]} light />
        </div>

        <div className="max-w-3xl">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXALT JESUS. MAKE DISCIPLES. SERVE OTHERS.</span>
          </div>

          {/* H1 Main Page Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4 drop-shadow-md">
            {title}
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow-xs">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
