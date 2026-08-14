import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Check,
  CalendarPlus,
  Compass,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { eventData } from '../data/eventData';
import type { Event } from '../types/event';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { EventCard } from '../components/events/EventCard';
import {
  createGoogleCalendarUrl,
  createOutlookCalendarUrl,
  downloadICSFile,
} from '../utils/calendar';

interface EventDetailPageProps {
  slug?: string;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ slug: propSlug }) => {
  const [copied, setCopied] = useState(false);

  const derivedSlug = propSlug || window.location.pathname.replace('/events/', '');

  const event: Event | undefined = eventData.events.find(
    (e) => e.slug === derivedSlug || e.id === derivedSlug
  );

  useEffect(() => {
    if (event) {
      document.title = `${event.title} | Church of God – Subic`;
      window.scrollTo(0, 0);
    } else {
      document.title = `Event Not Found | Church of God – Subic`;
    }
  }, [event]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-slate-50">
        <div className="w-16 h-16 bg-navy/10 text-navy rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-gold" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy uppercase mb-2 font-sans">
          Event Not Found
        </h1>
        <p className="text-slate-600 mb-6 max-w-md font-sans">
          The gathering or service you are looking for may have been moved or updated.
        </p>
        <Button variant="primary" onClick={() => navigateTo('/events')} icon={ArrowLeft}>
          BACK TO ALL EVENTS
        </Button>
      </div>
    );
  }

  const isPending = event.status === 'pending_verification';
  const relatedEvents = eventData.events
    .filter((e) => e.id !== event.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.shortDescription,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-navy text-white border-b border-gold/30 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Events', href: '/events' },
                { label: event.title },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gold text-navy font-black text-xs uppercase px-3 py-1 rounded-md">
              {event.category}
            </span>
            {event.recurring && (
              <span className="bg-white/10 text-slate-200 border border-white/20 text-xs px-2.5 py-1 rounded-md">
                {event.recurrenceRule || 'Recurring Event'}
              </span>
            )}
            {isPending && (
              <ContentVerificationBadge
                status={event.status}
                notes={event.meta?.notes}
              />
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight mb-4">
            {event.title}
          </h1>

          <p className="text-slate-200 text-base sm:text-lg max-w-3xl leading-relaxed">
            {event.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Image */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg aspect-[16/9]">
              <img
                src={event.imageUrl}
                alt={event.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Description Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-navy uppercase tracking-tight pb-3 border-b border-slate-100">
                About This Gathering
              </h2>

              <p className="text-slate-700 leading-relaxed font-sans text-base whitespace-pre-line">
                {event.description}
              </p>

              {/* Scripture Highlight if available */}
              {event.scripture && (
                <div className="p-5 bg-gold/10 border-l-4 border-gold rounded-r-xl space-y-2">
                  <div className="flex items-center space-x-2 text-navy font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-gold" />
                    <span>Scripture Focus: {event.scripture.reference}</span>
                  </div>
                  {event.scripture.text && (
                    <p className="text-slate-700 italic text-sm">
                      "{event.scripture.text}"
                    </p>
                  )}
                </div>
              )}

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                    Tags:
                  </span>
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Registration Information Section */}
            <div id="register" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-navy uppercase tracking-tight pb-3 border-b border-slate-100">
                Registration & Participation
              </h2>

              {event.registration?.required ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800 text-sm">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Registration Required</p>
                      <p className="text-emerald-700 text-xs">
                        {event.registration.fee || 'Free of charge'} • Deadline:{' '}
                        {event.registration.deadline || 'Prior to event start'}
                      </p>
                    </div>
                  </div>

                  {event.registration.isOpen ? (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600">
                        Reserve your seat or register as a participant to receive updates and event materials.
                      </p>
                      {event.registration.registrationUrl ? (
                        <a
                          href={event.registration.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-md"
                        >
                          <span>COMPLETE ONLINE REGISTRATION</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                          Official online registration link is pending verification. Please contact ministry staff for manual registration.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium">
                      Registration for this event is currently closed.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm">
                  <p className="font-bold text-navy mb-1">Open To All — No Registration Required</p>
                  <p className="text-xs leading-relaxed">
                    Registration information coming soon for specialized workshops. Sunday worship and public prayer gatherings do not require prior registration. All visitors are warmly welcome.
                  </p>
                </div>
              )}
            </div>

            {/* Plan Your Visit CTA */}
            <div className="bg-gradient-to-r from-navy to-slate-900 border border-gold/30 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-gold text-xs font-black uppercase tracking-widest block">
                  FIRST TIME AT CHURCH OF GOD SUBIC?
                </span>
                <h3 className="text-2xl font-black text-white">Plan Your Visit Today</h3>
                <p className="text-slate-300 text-sm max-w-md">
                  We would love to welcome you! Get directions, parking information, and let our team host you.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={Compass}
                onClick={() => navigateTo('/visit')}
              >
                PLAN YOUR VISIT
              </Button>
            </div>
          </div>

          {/* Sidebar / Key Details Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
              <h3 className="text-lg font-black text-navy uppercase tracking-tight border-b border-slate-100 pb-3">
                Gathering Details
              </h3>

              {/* Date & Time */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-navy">Date</span>
                    <span className="text-slate-600">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-navy">Time</span>
                    <span className="text-slate-600">
                      {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-navy">Location</span>
                    <span className="text-slate-700 font-semibold">{event.location.name}</span>
                    {event.location.address && (
                      <span className="block text-slate-500 text-xs">{event.location.address}</span>
                    )}
                    {event.location.city && (
                      <span className="block text-slate-500 text-xs">{event.location.city}</span>
                    )}
                    {event.location.roomOrHall && (
                      <span className="block text-gold text-xs font-bold mt-0.5">
                        {event.location.roomOrHall}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Calendar Abstraction */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Add To Calendar
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={createGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-lg transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4 text-gold" />
                    <span>Google Calendar</span>
                  </a>

                  <a
                    href={createOutlookCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-lg transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4 text-navy" />
                    <span>Outlook Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadICSFile(event)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-navy hover:bg-navy/90 text-gold font-bold text-xs rounded-lg transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4 text-gold" />
                    <span>Download iCal / ICS File</span>
                  </button>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share Event Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Contact Information */}
              {event.contact && (
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <span className="block font-bold uppercase tracking-wider text-slate-500">
                    Organizer Contact
                  </span>
                  {event.organizer && (
                    <p className="font-semibold text-navy">{event.organizer}</p>
                  )}
                  {event.contact.name && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <User className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{event.contact.name}</span>
                    </div>
                  )}
                  {event.contact.email && (
                    <div className="flex items-center space-x-2 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                      <a href={`mailto:${event.contact.email}`} className="hover:underline text-navy">
                        {event.contact.email}
                      </a>
                    </div>
                  )}
                  {event.contact.phone && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{event.contact.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-black text-navy uppercase tracking-tight mb-6">
              More Upcoming Gatherings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <EventCard
                  key={rel.id}
                  event={rel}
                  onSelect={(s) => navigateTo(`/events/${s}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
