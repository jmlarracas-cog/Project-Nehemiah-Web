import React, { useState, useMemo } from 'react';
import type { Event } from '../../types/event';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, ArrowRight } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface EventCalendarProps {
  events: Event[];
  onSelectEvent: (slug: string) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ events, onSelectEvent }) => {
  // Find default active month from upcoming events (e.g. August 2026)
  const defaultYearMonth = useMemo(() => {
    if (events.length > 0) {
      const firstDate = events[0].startDate;
      if (firstDate && firstDate.includes('-')) {
        const [y, m] = firstDate.split('-');
        return { year: parseInt(y, 10), month: parseInt(m, 10) - 1 };
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [events]);

  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(defaultYearMonth.year, defaultYearMonth.month, 1)
  );

  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    events.length > 0 ? events[0].startDate : ''
  );

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const resetToTarget = () => {
    setCurrentDate(new Date(defaultYearMonth.year, defaultYearMonth.month, 1));
    if (events.length > 0) {
      setSelectedDateStr(events[0].startDate);
    }
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map events by date (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((evt) => {
      if (!map[evt.startDate]) {
        map[evt.startDate] = [];
      }
      map[evt.startDate].push(evt);
    });
    return map;
  }, [events]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      hasEvents: boolean;
      eventCount: number;
      eventsList: Event[];
    }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const evts = eventsByDate[dateStr] || [];
      days.push({
        day,
        dateStr,
        isCurrentMonth: false,
        hasEvents: evts.length > 0,
        eventCount: evts.length,
        eventsList: evts,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const m = currentMonth + 1;
      const dateStr = `${currentYear}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const evts = eventsByDate[dateStr] || [];
      days.push({
        day,
        dateStr,
        isCurrentMonth: true,
        hasEvents: evts.length > 0,
        eventCount: evts.length,
        eventsList: evts,
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let day = 1; day <= remaining; day++) {
        const m = currentMonth + 2 > 12 ? 1 : currentMonth + 2;
        const y = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const evts = eventsByDate[dateStr] || [];
        days.push({
          day,
          dateStr,
          isCurrentMonth: false,
          hasEvents: evts.length > 0,
          eventCount: evts.length,
          eventsList: evts,
        });
      }
    }

    return days;
  }, [currentYear, currentMonth, eventsByDate]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return eventsByDate[selectedDateStr] || [];
  }, [eventsByDate, selectedDateStr]);

  // Format date helper
  const formatSelectedDateLabel = (dateStr: string) => {
    if (!dateStr) return 'Select a date on the calendar';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      return dateStr;
    }
    return dateStr;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="bg-navy p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/40 text-gold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <p className="text-xs text-slate-300">
              Interactive Gatherings & Service Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={resetToTarget}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
          >
            Today / Active Month
          </button>
          <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded text-slate-200 hover:text-gold hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded text-slate-200 hover:text-gold hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Body: 2 Columns on Large Desktop (Calendar Grid + Selected Date Events) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT / TOP: Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs font-black text-slate-400 uppercase tracking-wider py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr === selectedDateStr;
              return (
                <button
                  key={`${item.dateStr}-${idx}`}
                  type="button"
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`relative min-h-[52px] sm:min-h-[64px] p-1.5 sm:p-2 rounded-xl text-left flex flex-col justify-between transition-all border ${
                    isSelected
                      ? 'bg-navy text-white border-gold shadow-md ring-2 ring-gold/50'
                      : item.isCurrentMonth
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                      : 'bg-slate-100/50 text-slate-400 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-black rounded-md px-1 ${
                        isSelected
                          ? 'text-gold'
                          : item.hasEvents
                          ? 'text-navy font-black'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.day}
                    </span>
                    {item.hasEvents && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-gold' : 'bg-gold animate-pulse'
                        }`}
                      />
                    )}
                  </div>

                  {/* Compact Event Pills in Grid */}
                  <div className="w-full space-y-1 mt-1 overflow-hidden">
                    {item.eventsList.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className={`text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-gold/20 text-navy border border-gold/30'
                        }`}
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {item.eventsList.length > 2 && (
                      <div
                        className={`text-[8px] sm:text-[9px] font-extrabold px-1 ${
                          isSelected ? 'text-gold' : 'text-slate-500'
                        }`}
                      >
                        +{item.eventsList.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" />
              <span>Indicates scheduled event / celebration</span>
            </div>
            <span>Click any day to view details</span>
          </div>
        </div>

        {/* RIGHT / BOTTOM: Selected Day Events Drawer/Panel (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold block">
                  SELECTED DATE
                </span>
                <h4 className="text-base sm:text-lg font-black text-navy leading-snug">
                  {formatSelectedDateLabel(selectedDateStr)}
                </h4>
              </div>
              <span className="text-xs font-bold bg-navy text-gold px-2.5 py-1 rounded-full">
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            {/* Event List on Selected Date */}
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt.slug)}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-gold/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gold/20 text-navy px-2 py-0.5 rounded border border-gold/30">
                        {evt.category}
                      </span>
                      {evt.status === 'pending_verification' && (
                        <ContentVerificationBadge status="pending_verification" className="text-[9px]" />
                      )}
                    </div>

                    <h5 className="text-sm font-black text-navy group-hover:text-gold transition-colors line-clamp-1">
                      {evt.title}
                    </h5>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {evt.shortDescription}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{evt.startTime || 'Time TBA'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate max-w-[140px]">{evt.location.name}</span>
                      </div>
                      <div className="flex items-center text-navy font-bold group-hover:text-gold ml-auto pt-1 sm:pt-0">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">
                  No public events scheduled for this date.
                </p>
                <p className="text-[11px] text-slate-400">
                  Select another day or browse all gatherings in list view.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                if (events.length > 0) {
                  onSelectEvent(events[0].slug);
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-navy hover:bg-navy/90 text-gold hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore All Gatherings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
