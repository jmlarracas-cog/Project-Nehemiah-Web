import React from 'react';
import { HeartHandshake, ShieldCheck, Heart } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface PrayerIntroProps {
  title: string;
  description: string[];
  status?: string;
}

export const PrayerIntro: React.FC<PrayerIntroProps> = ({
  title,
  description,
  status = 'pending_verification',
}) => {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {status === 'pending_verification' && (
            <div className="inline-block mb-2">
              <ContentVerificationBadge
                status="pending_verification"
                notes="Church of God Subic prayer ministry guidelines awaiting final pastoral confirmation."
              />
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-black text-navy uppercase tracking-tight font-sans">
            {title}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 font-sans leading-relaxed text-sm sm:text-base">
          {description.map((paragraph, index) => (
            <div
              key={index}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-gold/40 transition-colors shadow-sm"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-navy/10 text-gold rounded-xl flex items-center justify-center font-bold">
                  {index === 0 && <HeartHandshake className="w-5 h-5 text-gold" />}
                  {index === 1 && <Heart className="w-5 h-5 text-gold" />}
                  {index === 2 && <ShieldCheck className="w-5 h-5 text-gold" />}
                </div>
                <p className="text-slate-700 font-sans leading-relaxed text-sm">
                  {paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
