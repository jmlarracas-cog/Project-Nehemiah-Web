import React from 'react';
import { Button } from '../ui/Button';
import { assetMap } from '../../config/assets';

interface AboutCTAProps {
  title?: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export const AboutCTA: React.FC<AboutCTAProps> = ({
  title = "THERE'S A PLACE FOR YOU HERE",
  subtitle = "Come worship with us, grow in Christ, and discover your place in God's mission in Subic, Zambales.",
  primaryAction = { label: 'PLAN YOUR VISIT', href: '/visit' },
  secondaryAction = { label: 'CONTACT US', href: '/contact' },
}) => {
  return (
    <section className="relative py-20 bg-navy text-white overflow-hidden border-t border-gold/30">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 filter brightness-90"
        style={{ backgroundImage: `url("${assetMap.gospelBg.url}")` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/90 to-navy-dark" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-black uppercase text-gold tracking-widest block mb-3">
          WELCOME TO CHURCH OF GOD SUBIC
        </span>

        <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-4 drop-shadow-md">
          {title}
        </h2>

        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" href={primaryAction.href} className="w-full sm:w-auto justify-center">
            {primaryAction.label}
          </Button>
          <Button variant="outline" size="lg" href={secondaryAction.href} className="w-full sm:w-auto justify-center">
            {secondaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
};
