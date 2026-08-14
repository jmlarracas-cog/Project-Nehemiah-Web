import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { PrayerPageData } from '../../types/prayer';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface PrayerPrivacyNoticeProps {
  notice: PrayerPageData['privacyNotice'];
}

export const PrayerPrivacyNotice: React.FC<PrayerPrivacyNoticeProps> = ({ notice }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy text-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-gold block">
                  HOW WE HANDLE PRAYER REQUESTS
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  {notice.title}
                </h3>
              </div>
            </div>
            <div className="shrink-0">
              <ContentVerificationBadge
                status="pending_verification"
                notes="Official church privacy & data retention policy under pastoral review."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notice.points.map((point, index) => (
              <div key={index} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200">
                <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 italic pt-2 border-t border-white/10">
            Official privacy, confidentiality, and data retention policies for Church of God Subic are currently pending final church governance review.
          </p>
        </div>
      </div>
    </section>
  );
};
