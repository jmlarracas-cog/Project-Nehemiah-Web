import React from 'react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { assetMap } from '../../../config/assets';
import { HeartHandshake } from 'lucide-react';

export const PrayerCTA: React.FC = () => {
  return (
    <section className="relative py-24 bg-navy text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
        style={{ backgroundImage: `url("${assetMap.prayerBg.url}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy/90 to-navy-dark/80" />

      <Container size="normal" className="relative z-10 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto mb-6">
          <HeartHandshake className="w-8 h-8 text-gold" />
        </div>

        <span className="text-xs font-black uppercase text-gold tracking-widest block mb-2">
          STANDING WITH YOU
        </span>

        <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          WE WOULD LOVE TO PRAY WITH YOU
        </h2>

        <p className="text-base sm:text-xl text-gray-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Whatever burden, sickness, financial strain, or family struggle you are carrying—you don’t have to carry it alone. Our pastoral prayer team intercedes daily for your needs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" href="/prayer">
            SUBMIT A PRAYER REQUEST
          </Button>
          <Button variant="outline" size="lg" href="/contact">
            TALK TO A PASTOR
          </Button>
        </div>
      </Container>
    </section>
  );
};
