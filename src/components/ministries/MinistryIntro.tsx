import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { BookOpen, Heart, Users, Sparkles } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface MinistryIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string[];
  scripture?: {
    reference: string;
    text: string;
  };
}

export const MinistryIntro: React.FC<MinistryIntroProps> = ({
  eyebrow,
  title,
  subtitle,
  description,
  scripture,
}) => {
  return (
    <section className="py-16 sm:py-20 bg-white text-navy border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Scripture */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
            />

            <div className="space-y-4 text-slate-700 leading-relaxed font-normal text-base sm:text-lg">
              {description.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Scripture Highlight Box */}
            {scripture && (
              <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border-l-4 border-gold shadow-sm flex items-start space-x-4 mt-6">
                <BookOpen className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-base italic text-navy font-serif font-medium leading-relaxed">
                    "{scripture.text}"
                  </p>
                  <span className="text-xs font-black uppercase text-gold tracking-widest block mt-2">
                    — {scripture.reference}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 4 Pillar Feature Cards Grid */}
          <div className="lg:col-span-5">
            <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gold/30 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gold/10 blur-xl pointer-events-none" />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-wider text-white">
                  MINISTRY PILLARS
                </h3>
                <ContentVerificationBadge
                  status="pending_verification"
                  compact
                  label="DEMO FRAMEWORK"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-navy-dark/80 border border-gold/20 hover:border-gold/50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold mb-3 font-black text-sm">
                    01
                  </div>
                  <h4 className="font-extrabold uppercase text-gold text-sm tracking-wide mb-1">
                    GATHER
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Uniting in worship & corporate praise
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-dark/80 border border-gold/20 hover:border-gold/50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold mb-3 font-black text-sm">
                    02
                  </div>
                  <h4 className="font-extrabold uppercase text-gold text-sm tracking-wide mb-1">
                    GROW
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Deepening in truth through discipleship
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-dark/80 border border-gold/20 hover:border-gold/50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold mb-3 font-black text-sm">
                    03
                  </div>
                  <h4 className="font-extrabold uppercase text-gold text-sm tracking-wide mb-1">
                    GO
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Serving Subic, Zambales through compassionate action
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-dark/80 border border-gold/20 hover:border-gold/50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold mb-3 font-black text-sm">
                    04
                  </div>
                  <h4 className="font-extrabold uppercase text-gold text-sm tracking-wide mb-1">
                    EXALT JESUS
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Glorifying Christ in every sphere of life
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
