import React from 'react';
import { ShieldAlert, Heart } from 'lucide-react';
import { Container } from '../ui/Container';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';
import { BrandLogo } from '../ui/BrandLogo';

interface VisitHeroProps {
  title?: string;
  goldSubtitle?: string;
  subtitle?: string;
  bgImage?: string;
}

export const VisitHero: React.FC<VisitHeroProps> = ({
  title = 'PLAN YOUR VISIT',
  goldSubtitle = 'WE WOULD LOVE TO WELCOME YOU',
  subtitle = 'Whether you are looking for a church family or seeking spiritual guidance, we welcome you with open arms.',
  bgImage = 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=2000'
}) => {
  return (
    <section className="relative bg-navy text-white overflow-hidden py-16 sm:py-24 border-b border-navy-light">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={bgImage}
          alt="Church of God Subic Worship Gathering"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-navy" />
      </div>

      {/* Decorative Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy via-gold to-navy z-10" />

      <Container size="wide" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="/" className="hover:text-gold transition-colors">Home</a>
            <span className="text-gold/60">•</span>
            <span className="text-gold">Plan Your Visit</span>
          </nav>

          {/* Official Church Logo Branding */}
          <div className="flex justify-center pt-2">
            <BrandLogo size="md" variant="light" className="opacity-95" />
          </div>

          {/* Verification Governance Badge */}
          <div className="pt-1 flex justify-center">
            <ContentVerificationBadge
              status="pending_verification"
              notes="Worship gathering schedules & visitor logistics are undergoing pastoral verification."
            />
          </div>

          {/* Header Typography */}
          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-black tracking-widest text-gold uppercase flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-gold" />
              <span>{goldSubtitle}</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
              {title}
            </h1>
            <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Informational Governance Alert */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="p-3.5 bg-navy-light/80 rounded-xl border border-gold/20 text-xs text-slate-300 flex items-start space-x-3 text-left">
              <ShieldAlert className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-gold font-bold">Visitor Logistics Notice:</strong> Service schedules, parking guidelines, and facility check-in procedures presented on this page are structured architectural guides. Official times will be confirmed upon pastoral review.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
