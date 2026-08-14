import React from 'react';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

interface MinistryCTAProps {
  title: string;
  subtitle: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
}

export const MinistryCTA: React.FC<MinistryCTAProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden border-t border-gold/30">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-black uppercase tracking-widest backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SERVE WITH PURPOSE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white max-w-3xl mx-auto leading-tight">
          {title}
        </h2>

        <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" href={primaryAction.href}>
            {primaryAction.label}
          </Button>

          <Button variant="outline" size="lg" href={secondaryAction.href} className="border-gold/40 text-gold hover:bg-gold/10">
            {secondaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
};
