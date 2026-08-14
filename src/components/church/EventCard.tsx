import React from 'react';
import { EventItem } from '../../types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onRegister?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
      <div className="relative aspect-16/9 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-navy text-gold text-xs font-black uppercase tracking-widest px-3 py-1 rounded-xs shadow-md">
          {event.category}
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center text-xs text-slate-500 font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
            <span>{event.date}</span>
          </div>

          <h3 className="text-xl font-black text-navy group-hover:text-gold transition-colors mb-2 leading-tight">
            {event.title}
          </h3>

          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <span className="truncate">
                {typeof event.location === 'string' ? event.location : event.location?.name}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6">
            {event.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {event.registrationOpen ? 'Registration Open' : 'Free Entry'}
          </span>
          <button
            onClick={() => onRegister && onRegister(event)}
            className="inline-flex items-center text-xs font-black uppercase tracking-wider text-navy hover:text-gold transition-colors cursor-pointer"
          >
            Details & RSVP <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
