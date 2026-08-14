import React from 'react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { assetMap } from '../../../config/assets';
import { Cross, Sparkles } from 'lucide-react';

export const GospelSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-background border-t border-slate-200 overflow-hidden">
      <Container size="normal" className="text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-navy font-bold text-xs uppercase tracking-widest mb-6">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>THE GOOD NEWS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black uppercase text-navy tracking-tight mb-6">
          JESUS CHANGES LIVES
        </h2>

        <p className="text-lg sm:text-2xl text-slate-700 font-light max-w-3xl mx-auto mb-8 leading-relaxed">
          God loves you unconditionally. No matter your background, past mistakes, or present struggles, eternal hope, forgiveness, and brand new life are available today through faith in Jesus Christ.
        </p>

        <div className="bg-white p-8 rounded-md shadow-lg border border-slate-100 max-w-2xl mx-auto mb-10 text-left">
          <div className="flex items-start space-x-4">
            <Cross className="w-8 h-8 text-gold shrink-0 mt-1" />
            <div>
              <h3 className="font-black text-navy text-lg uppercase mb-2">The Gift of Salvation</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life." — John 3:16
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you would like to know Jesus personally or surrender your life to Him today, we are here to walk alongside you step-by-step.
              </p>
            </div>
          </div>
        </div>

        <Button variant="secondary" size="lg" href="/contact">
          BEGIN YOUR JOURNEY WITH JESUS →
        </Button>
      </Container>
    </section>
  );
};
