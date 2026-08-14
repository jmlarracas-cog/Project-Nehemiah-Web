import React, { useState } from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Container } from '../../../components/ui/Container';
import { EventCard } from '../../../components/church/EventCard';
import { eventsData } from '../../../data/churchData';
import { EventItem } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { X, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';

export const UpcomingEvents: React.FC = () => {
  const featuredEvents = eventsData.slice(0, 3);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
    setTimeout(() => {
      setRegistered(false);
      setSelectedEvent(null);
    }, 2500);
  };

  return (
    <section className="py-20 bg-slate-50">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <SectionHeader
            eyebrow="GATHERING TOGETHER"
            title="UPCOMING EVENTS"
            subtitle="Connect with our faith family through worship rallies, youth conferences, and community outreach."
            className="mb-0"
          />
          <div className="mt-4 md:mt-0">
            <Button variant="outline" size="md" href="/events" className="border-navy text-navy hover:bg-navy hover:text-white">
              VIEW FULL CALENDAR →
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {featuredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegister={(event) => setSelectedEvent(event)}
            />
          ))}
        </div>
      </Container>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-navy text-white flex justify-between items-center border-b border-navy-dark">
              <div>
                <span className="text-[10px] font-black uppercase text-gold tracking-widest">{selectedEvent.category}</span>
                <h3 className="text-lg font-black uppercase">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {registered ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-navy">Registration Confirmed!</h4>
                  <p className="text-sm text-slate-600 mt-1">We look forward to seeing you at {selectedEvent.title}.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded border border-slate-100">
                    <div className="flex items-center"><Calendar className="w-4 h-4 text-gold mr-2" /> {selectedEvent.date}</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 text-gold mr-2" /> {selectedEvent.time}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 text-gold mr-2" /> {selectedEvent.location}</div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Full Name *</label>
                      <input required type="text" placeholder="e.g. Juan Dela Cruz" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-gold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email or Phone Number *</label>
                      <input required type="text" placeholder="e.g. juan@example.com or 09171234567" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-gold" />
                    </div>
                    <Button variant="primary" size="md" className="w-full mt-2">
                      CONFIRM RSVP
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
