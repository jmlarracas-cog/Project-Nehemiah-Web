import React from 'react';
import { CoreBelief } from '../../types/about';
import { SectionHeader } from '../ui/SectionHeader';
import { BookOpen, Heart, Flame, Users, Sparkles, BookCheck, Shield } from 'lucide-react';

interface CoreBeliefsProps {
  beliefs: CoreBelief[];
}

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6 text-gold" />,
  Heart: <Heart className="w-6 h-6 text-gold" />,
  Flame: <Flame className="w-6 h-6 text-gold" />,
  Users: <Users className="w-6 h-6 text-gold" />,
  Sparkles: <Sparkles className="w-6 h-6 text-gold" />,
  Cross: <BookCheck className="w-6 h-6 text-gold" />,
  Shield: <Shield className="w-6 h-6 text-gold" />,
};

export const CoreBeliefs: React.FC<CoreBeliefsProps> = ({ beliefs }) => {
  return (
    <section className="py-20 bg-slate-50 text-navy border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="OUR DOCTRINAL PILLARS"
          title="CORE BELIEFS"
          subtitle="What we hold as unalterable truths in God's holy word."
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
          {beliefs.map((belief) => (
            <div
              key={belief.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-gold/50 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-navy/5 border border-navy/10 flex items-center justify-center mb-5 group-hover:bg-navy group-hover:text-gold transition-colors duration-300">
                  {iconMap[belief.iconName] || <BookOpen className="w-6 h-6 text-gold" />}
                </div>

                <h3 className="text-lg font-black uppercase text-navy tracking-tight mb-2 group-hover:text-gold transition-colors">
                  {belief.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4 font-normal">
                  {belief.description}
                </p>
              </div>

              {belief.scripture && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Scripture Anchor
                  </span>
                  <span className="text-xs font-bold text-gold uppercase bg-navy px-2.5 py-1 rounded">
                    {belief.scripture}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
