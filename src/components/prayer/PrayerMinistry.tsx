import React from 'react';
import { Users, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

export const PrayerMinistry: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-block mb-1">
            <ContentVerificationBadge
              status="pending_verification"
              notes="Prayer gathering schedules & intercessory team guidelines awaiting official church confirmation."
            />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-gold block">
            CHURCH OF GOD SUBIC PRAYER MINISTRY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            Intercessory Prayer Ministry
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Our prayer intercessors gather regularly to lift up submitted requests, our congregation, and the local Subic, Zambales community in prayer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prayer Meetings Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-navy">
                <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center text-gold">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Corporate Prayer Gatherings
                </h3>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              We invite everyone to stand together in corporate prayer. Official gathering schedules will be finalized upon pastoral review.
            </p>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Representative Schedule (Pending Verification):</span>
              </div>
              <p className="text-slate-700 font-medium pl-5">
                Wednesdays • 6:30 PM - 8:00 PM (To be confirmed by church leadership)
              </p>
              <div className="flex items-center space-x-1.5 pt-1 text-slate-600">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Main Worship Sanctuary / Online Prayer Channel</span>
              </div>
            </div>
          </div>

          {/* Join Prayer Team Card */}
          <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 space-y-4 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                  <Users className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Serving in Prayer Ministry
                  </h3>
                  <span className="text-[10px] text-gold uppercase tracking-wider font-extrabold block">
                    Pending Pastoral Guidelines
                  </span>
                </div>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed">
                If you carry a heart for intercessory prayer, official procedures for joining the prayer ministry team will be shared following pastoral confirmation.
              </p>
            </div>

            <div className="pt-4 relative z-10">
              <Button
                variant="outline"
                size="sm"
                className="border-gold text-gold hover:bg-gold hover:text-navy font-bold"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => {
                  window.location.href = '#prayer-form-section';
                }}
              >
                SUBMIT PRAYER INQUIRY
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
