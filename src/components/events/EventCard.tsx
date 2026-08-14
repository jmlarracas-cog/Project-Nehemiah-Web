import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Event } from '../../types/event';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface EventCardProps {
  event: Event;
  onSelect?: (slug: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const isPending = event.status === 'pending_verification';
  const eventDate = new Date(event.startDate);
  const monthStr = eventDate.toLocaleDateString('en-US', { month: 'short' });
  const dayStr = eventDate.getDate();

  return (
    <article
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={() => onSelect?.(event.slug)}
    >
      {/* Top Image Container with Date Overlay & Category */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={event.imageUrl}
          alt={event.imageAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-80" />

        {/* Floating Date Badge */}
        <div className="absolute top-3 left-3 bg-navy/90 text-white border border-gold/40 backdrop-blur-md rounded-xl px-3 py-1.5 text-center shadow-lg">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gold">
            {monthStr}
          </span>
          <span className="block text-xl font-black leading-none text-white">
            {dayStr}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-gold/90 text-navy text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
          {event.category}
        </div>

        {/* Recurring Badge */}
        {event.recurring && (
          <div className="absolute top-3 right-3 bg-navy/80 text-slate-200 text-[10px] font-semibold px-2 py-1 rounded border border-white/20 backdrop-blur-sm">
            Recurring
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Status Badge if pending */}
          {isPending && (
            <div className="mb-1">
              <ContentVerificationBadge
                status={event.status}
                notes={event.meta?.notes}
                compact
              />
            </div>
          )}

          {/* Event Title */}
          <h3 className="text-lg sm:text-xl font-bold text-navy group-hover:text-gold transition-colors line-clamp-2 leading-snug font-sans">
            {event.title}
          </h3>

          {/* Short Description */}
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans">
            {event.shortDescription}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-sans">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="truncate">{event.location.name}</span>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 flex items-center justify-between text-xs font-bold text-navy group-hover:text-gold transition-colors">
          <span className="uppercase tracking-wider">VIEW DETAILS</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};
