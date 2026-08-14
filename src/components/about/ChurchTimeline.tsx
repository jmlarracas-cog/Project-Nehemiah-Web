import React from 'react';
import { TimelineEvent } from '../../types/about';
import { SectionHeader } from '../ui/SectionHeader';
import { Calendar, BookOpen } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface ChurchTimelineProps {
  events: TimelineEvent[];
}

export const ChurchTimeline: React.FC<ChurchTimelineProps> = ({ events }) => {
  const hasUnverified = events.some(
    (e) => e.status === 'pending_verification' || e.isVerified === false
  );

  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          eyebrow="MILESTONES OF FAITH"
          title="OUR CHURCH JOURNEY"
          subtitle="Tracing God's miraculous leading through the years."
          light
          centered
        />

        {hasUnverified && (
          <div className="flex justify-center mt-4">
            <ContentVerificationBadge
              status="pending_verification"
              label="DEMO TIMELINE — PENDING OFFICIAL CHURCH ARCHIVIST VERIFICATION"
            />
          </div>
        )}

        <div className="mt-14 relative">
          {/* Vertical Central Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/40 to-gold/10 transform -translate-x-1/2" />

          {/* Vertical Left Line (Mobile/Tablet) */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/40 to-gold/10" />

          <div className="space-y-12 lg:space-y-16">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const isPending =
                event.status === 'pending_verification' || event.isVerified === false;

              return (
                <div
                  key={event.id}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot Node */}
                  <div className="absolute left-6 lg:left-1/2 w-8 h-8 rounded-full bg-navy border-2 border-gold flex items-center justify-center transform -translate-x-1/2 z-20 shadow-lg shadow-gold/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                  </div>

                  {/* Content Box */}
                  <div className="ml-14 lg:ml-0 lg:w-1/2 px-0 lg:px-10 w-full">
                    <div className="bg-navy-dark/90 border border-gold/25 hover:border-gold/60 rounded-xl p-6 sm:p-7 shadow-2xl transition-all duration-300 group">
                      {/* Year Badge & Status Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-gold/15 border border-gold/30 text-gold text-xs sm:text-sm font-black tracking-wider uppercase">
                          <Calendar className="w-4 h-4" />
                          <span>{event.year}</span>
                        </div>

                        {isPending && (
                          <ContentVerificationBadge
                            status="pending_verification"
                            compact
                            label="DEMO RECORD"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight mb-2 group-hover:text-gold transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal mb-4">
                        {event.description}
                      </p>

                      {/* Image Preview if provided */}
                      {event.imageUrl && (
                        <div className="rounded-lg overflow-hidden my-3 border border-gold/20 max-h-52">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Scripture Anchor */}
                      {event.scripture && (
                        <div className="pt-3 border-t border-gold/15 flex items-center text-xs sm:text-sm text-gold font-bold uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>{event.scripture}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
