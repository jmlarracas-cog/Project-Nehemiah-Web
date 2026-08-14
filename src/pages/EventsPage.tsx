import React, { useState, useEffect, useMemo } from 'react';
import { eventData } from '../data/eventData';
import type { Event } from '../types/event';
import { EventsHero } from '../components/events/EventsHero';
import { FeaturedEvent } from '../components/events/FeaturedEvent';
import { EventSearch } from '../components/events/EventSearch';
import { EventFilter, TimeFilterMode } from '../components/events/EventFilter';
import { EventGrid } from '../components/events/EventGrid';
import { EventCalendar } from '../components/events/EventCalendar';
import { Button } from '../components/ui/Button';
import { Compass, Calendar as CalendarIcon, LayoutGrid, CalendarDays } from 'lucide-react';
import { getDynamicFeaturedEvent, getManilaDateString, isEventUpcoming } from '../utils/calendar';

export const EventsPage: React.FC = () => {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new window.Event('popstate'));
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [timeMode, setTimeMode] = useState<TimeFilterMode>('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    document.title = eventData.seo.title;
    window.scrollTo(0, 0);
  }, []);

  // Today ISO date boundary in Asia/Manila timezone
  const todayStr = useMemo(() => getManilaDateString(), []);

  // Dynamic Featured Event (Nearest upcoming eligible event or fallback)
  const featuredEvent = useMemo(() => {
    return getDynamicFeaturedEvent(eventData.events, todayStr);
  }, [todayStr]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All Events') count++;
    if (timeMode !== 'upcoming') count++;
    if (searchTerm.trim() !== '') count++;
    return count;
  }, [selectedCategory, timeMode, searchTerm]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Events');
    setTimeMode('upcoming');
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventData.events.filter((event: Event) => {
      // 1. Time Mode Filter
      const isUpcoming = isEventUpcoming(event, todayStr);
      if (timeMode === 'upcoming' && !isUpcoming) {
        return false;
      }
      if (timeMode === 'past' && isUpcoming) {
        return false;
      }

      // 2. Category Filter
      if (
        selectedCategory !== 'All Events' &&
        event.category !== selectedCategory
      ) {
        return false;
      }

      // 3. Search Query Filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.shortDescription.toLowerCase().includes(query) || event.description.toLowerCase().includes(query);
        const matchesCategory = (typeof event.category === 'string' ? event.category : '').toLowerCase().includes(query);
        const matchesLocation = event.location.name.toLowerCase().includes(query) || (event.location.city || '').toLowerCase().includes(query);
        const matchesTags = event.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesLocation && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, timeMode, searchTerm, todayStr]);

  // Past events list for dedicated section if viewing upcoming mode
  const pastEventsList = useMemo(() => {
    if (timeMode === 'past') return [];
    return eventData.events.filter((e) => !isEventUpcoming(e, todayStr));
  }, [todayStr, timeMode]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. Hero Section */}
      <EventsHero
        title={eventData.hero.title}
        goldSubtitle={eventData.hero.goldSubtitle}
        subtitle={eventData.hero.subtitle}
        bgImage={eventData.hero.bgImage}
        imageAlt={eventData.hero.imageAlt}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* 2. Featured Event Banner */}
        {featuredEvent && (
          <section className="mb-12">
            <FeaturedEvent
              event={featuredEvent}
              onSelectEvent={(slug) => navigate(`/events/${slug}`)}
            />
          </section>
        )}

        {/* 3. Search & Filter Bar */}
        <section className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight font-sans">
              Find a Gathering
            </h2>
            <p className="text-slate-600 text-sm font-sans mt-1">
              Explore upcoming worship services, prayer meetings, and discipleship activities.
            </p>
          </div>

          <EventSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <EventFilter
            categories={eventData.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            timeMode={timeMode}
            onTimeModeChange={setTimeMode}
            onReset={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </section>

        {/* 4. Upcoming / Filtered Event Grid & Calendar View */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 mb-6 gap-4">
            <h3 className="text-xl font-black text-navy uppercase tracking-tight flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gold" />
              <span>
                {viewMode === 'calendar'
                  ? 'Gatherings Calendar'
                  : timeMode === 'upcoming'
                  ? 'Upcoming Gatherings'
                  : timeMode === 'past'
                  ? 'Past Gatherings'
                  : 'All Gatherings'}
              </span>
            </h3>

            {/* View Mode & Count */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
              </span>

              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/80">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-navy shadow-xs'
                      : 'text-slate-600 hover:text-navy'
                  }`}
                  aria-label="List View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-navy text-gold shadow-xs'
                      : 'text-slate-600 hover:text-navy'
                  }`}
                  aria-label="Calendar View"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Calendar</span>
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <EventCalendar
              events={filteredEvents}
              onSelectEvent={(slug) => navigate(`/events/${slug}`)}
            />
          ) : (
            <EventGrid
              events={filteredEvents}
              onSelectEvent={(slug) => navigate(`/events/${slug}`)}
            />
          )}
        </section>

        {/* 5. Past Events Section (Subdued treatment if past events exist) */}
        {pastEventsList.length > 0 && timeMode === 'upcoming' && (
          <section className="mb-16 pt-12 border-t border-slate-200 opacity-90">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  ARCHIVED
                </span>
                <h3 className="text-xl font-black text-slate-700 uppercase tracking-tight">
                  Recent Past Gatherings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTimeMode('past')}
                className="text-xs font-bold text-navy hover:text-gold uppercase tracking-wider underline"
              >
                View All Past Events
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 filter grayscale-[0.2]">
              {pastEventsList.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.slug}`)}
                  className="bg-slate-100 rounded-xl p-5 border border-slate-200 cursor-pointer hover:border-gold/50 transition-all"
                >
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    Past Event
                  </span>
                  <h4 className="font-bold text-slate-800 text-base mt-2 line-clamp-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {event.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Final Call To Action Banner */}
        <section className="mb-12 bg-navy border-2 border-gold/40 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 bg-gold/20 text-gold font-extrabold text-xs uppercase tracking-widest rounded-full border border-gold/30">
              JOIN OUR FELLOWSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Ready to Worship With Us in Subic?
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Whether you are looking for a spiritual home, prayer support, or a community to serve with, there is a place for you at Church of God Subic.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={Compass}
                onClick={() => navigate('/visit')}
              >
                PLAN YOUR VISIT
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
