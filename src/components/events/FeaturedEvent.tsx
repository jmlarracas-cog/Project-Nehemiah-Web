import React from 'react';
import { Calendar, Clock, MapPin, Tag, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { Event } from '../../types/event';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';
import { Button } from '../ui/Button';

interface FeaturedEventProps {
  event: Event;
  onSelectEvent?: (slug: string) => void;
}

export const FeaturedEvent: React.FC<FeaturedEventProps> = ({ event, onSelectEvent }) => {
  const isPending = event.status === 'pending_verification';

  return (
    <div className="relative bg-gradient-to-br from-navy via-navy/95 to-slate-900 border-2 border-gold/40 rounded-2xl overflow-hidden shadow-2xl text-white my-8">
      {/* Top Banner Tag */}
      <div className="bg-gold text-navy font-black text-xs uppercase tracking-widest px-4 py-1.5 inline-flex items-center space-x-2 rounded-br-lg shadow-md font-sans">
        <Tag className="w-3.5 h-3.5" />
        <span>Featured Church Gathering</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
        {/* Event Image Column */}
        <div className="lg:col-span-5 relative group rounded-xl overflow-hidden shadow-lg border border-gold/20 aspect-[4/3] sm:aspect-[16/10]">
          <img
            src={event.imageUrl}
            alt={event.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

          {/* Date Badge overlay */}
          <div className="absolute top-3 left-3 bg-navy/90 border border-gold/50 backdrop-blur-md text-center rounded-lg px-3 py-2 shadow-xl">
            <span className="block text-gold text-xs font-bold uppercase tracking-wider">
              {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="block text-white text-2xl font-black leading-none">
              {new Date(event.startDate).getDate()}
            </span>
          </div>

          {/* Category Tag overlay */}
          <div className="absolute bottom-3 left-3 bg-gold/90 text-navy font-extrabold text-xs uppercase px-2.5 py-1 rounded-md shadow">
            {event.category}
          </div>
        </div>

        {/* Event Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            {/* Status verification badge */}
            {isPending && (
              <div className="mb-2">
                <ContentVerificationBadge
                  status={event.status}
                  notes={event.meta?.notes}
                />
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-sans mb-3 hover:text-gold transition-colors cursor-pointer"
                onClick={() => onSelectEvent?.(event.slug)}>
              {event.title}
            </h2>

            {/* Event Short Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 font-sans line-clamp-3">
              {event.shortDescription}
            </p>

            {/* Event Key Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-200 bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                <span>
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>
                  {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                </span>
              </div>

              <div className="flex items-center space-x-2.5 col-span-1 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span className="truncate">
                  {event.location.name} ({event.location.city || 'Subic'})
                </span>
              </div>

              {event.registration?.required && (
                <div className="flex items-center space-x-2 col-span-1 sm:col-span-2 text-emerald-400 font-medium">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Registration Required • {event.registration.fee || 'Free'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => onSelectEvent?.(event.slug)}
            >
              VIEW EVENT DETAILS
            </Button>

            {event.registration?.required && event.registration.isOpen && (
              <a
                href={`/events/${event.slug}#register`}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>REGISTER NOW</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
