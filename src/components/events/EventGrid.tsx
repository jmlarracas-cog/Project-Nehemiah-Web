import React from 'react';
import { CalendarX } from 'lucide-react';
import { Event } from '../../types/event';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  onSelectEvent: (slug: string) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onSelectEvent,
  emptyTitle = "WE'RE PREPARING WHAT'S NEXT",
  emptySubtitle = 'Check back soon for upcoming gatherings, services, and opportunities to connect with Church of God Subic.',
}) => {
  if (events.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarX className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight mb-2 font-sans">
          {emptyTitle}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed font-sans max-w-md mx-auto">
          {emptySubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 my-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={onSelectEvent}
        />
      ))}
    </div>
  );
};
