import React from 'react';
import { BookOpen, Quote } from 'lucide-react';
import { PrayerScripturePassage } from '../../types/prayer';

interface PrayerScriptureProps {
  scriptures: PrayerScripturePassage[];
}

export const PrayerScripture: React.FC<PrayerScriptureProps> = ({ scriptures }) => {
  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-gold font-bold text-xs uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>GOD'S PROMISES REGARDING PRAYER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            Scripture Promises
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scriptures.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-gold/50 transition-colors"
            >
              <Quote className="absolute -top-2 -right-2 w-20 h-20 text-slate-100 -z-0 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-extrabold text-[11px] uppercase tracking-wider rounded-md">
                  {item.theme}
                </span>

                <blockquote className="text-slate-700 text-sm sm:text-base italic font-serif leading-relaxed">
                  "{item.text}"
                </blockquote>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 text-right">
                <cite className="not-italic font-black text-navy text-xs sm:text-sm font-sans uppercase tracking-wider">
                  — {item.reference}
                </cite>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
