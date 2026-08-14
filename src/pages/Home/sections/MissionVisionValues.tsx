import React from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Container } from '../../../components/ui/Container';
import { useSiteSettings } from '../../../context/SiteContext';
import { Compass, Eye, ShieldCheck, Heart } from 'lucide-react';

export const MissionVisionValues: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <SectionHeader
          eyebrow="OUR FOUNDATION"
          title="MISSION, VISION & VALUES"
          subtitle="Guided by Scripture and passionate for God's glory, our compass is set on transforming lives and communities."
          centered
          light
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* MISSION CARD */}
          <div className="bg-navy-dark/80 border border-gold/25 hover:border-gold/60 p-8 rounded-lg shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-all">
                <Compass className="w-6 h-6 text-gold" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gold block mb-2">
                OUR MANDATE
              </span>
              <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">
                OUR MISSION
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {settings.mission}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gold/15 text-xs font-bold text-gold uppercase tracking-wider">
              Matthew 28:19-20
            </div>
          </div>

          {/* VISION CARD */}
          <div className="bg-navy-dark/80 border border-gold/25 hover:border-gold/60 p-8 rounded-lg shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-all">
                <Eye className="w-6 h-6 text-gold" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gold block mb-2">
                OUR HOPE
              </span>
              <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">
                OUR VISION
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {settings.vision}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gold/15 text-xs font-bold text-gold uppercase tracking-wider">
              John 15:8
            </div>
          </div>

          {/* VALUES CARD */}
          <div className="bg-navy-dark/80 border border-gold/25 hover:border-gold/60 p-8 rounded-lg shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-all">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gold block mb-2">
                OUR PILLARS
              </span>
              <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">
                CORE VALUES
              </h3>
              <ul className="space-y-3 text-xs text-slate-300 font-light">
                {settings.values.map((val, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-gold/15 text-xs font-bold text-gold uppercase tracking-wider">
              Colossians 3:12-17
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
