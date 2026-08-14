import { Event } from '../types/event';

export function formatICSDatetime(dateStr: string, timeStr?: string): string {
  // Convert dateStr ("YYYY-MM-DD") and timeStr ("9:00 AM") into ICS format "YYYYMMDDTHHmmssZ"
  try {
    const cleanDate = dateStr.replace(/-/g, '');
    let hours = 9;
    let minutes = 0;

    if (timeStr) {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const isPM = match[3].toUpperCase() === 'PM';
        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        hours = h;
        minutes = m;
      }
    }

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${cleanDate}T${pad(hours)}${pad(minutes)}00`;
  } catch {
    return dateStr.replace(/-/g, '') + 'T090000';
  }
}

export function createGoogleCalendarUrl(event: Event): string {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(
    `${event.shortDescription}\n\nChurch of God – Subic\nhttps://cogsubic.org/events/${event.slug}`
  );
  const location = encodeURIComponent(
    [event.location.name, event.location.address, event.location.city]
      .filter(Boolean)
      .join(', ')
  );

  const startIso = formatICSDatetime(event.startDate, event.startTime);
  const endIso = formatICSDatetime(event.endDate || event.startDate, event.endTime || '11:30 AM');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
}

export function createOutlookCalendarUrl(event: Event): string {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.shortDescription);
  const location = encodeURIComponent(
    [event.location.name, event.location.address, event.location.city]
      .filter(Boolean)
      .join(', ')
  );

  const startIso = formatICSDatetime(event.startDate, event.startTime);
  const endIso = formatICSDatetime(event.endDate || event.startDate, event.endTime || '11:30 AM');

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&body=${details}&location=${location}&startdt=${startIso}&enddt=${endIso}`;
}

export function getManilaDateString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

export function isEventUpcoming(
  event: { startDate?: string; date?: string; endDate?: string },
  refDateStr?: string
): boolean {
  const start = event.startDate || event.date;
  if (!start) return true;
  const today = refDateStr || getManilaDateString();
  const effectiveEndDate = event.endDate || start;
  return effectiveEndDate >= today;
}

export function getDynamicFeaturedEvent(
  events: Event[],
  refDateStr?: string
): Event | null {
  if (!events || events.length === 0) return null;

  const today = refDateStr || getManilaDateString();

  // 1. Filter for upcoming or active today
  const upcoming = events
    .filter((e) => isEventUpcoming(e, today))
    .sort((a, b) => {
      const dateA = a.startDate || a.date || '';
      const dateB = b.startDate || b.date || '';
      return dateA.localeCompare(dateB);
    });

  if (upcoming.length > 0) {
    return upcoming[0];
  }

  // 2. Fallback: explicit featured flag
  const explicitFeatured = events.find((e) => e.featured);
  if (explicitFeatured) return explicitFeatured;

  // 3. Fallback: most recent past event
  const past = [...events].sort((a, b) => {
    const dateA = a.startDate || a.date || '';
    const dateB = b.startDate || b.date || '';
    return dateB.localeCompare(dateA);
  });
  return past[0] || events[0] || null;
}

export function downloadICSFile(event: Event): void {
  const startIso = formatICSDatetime(event.startDate, event.startTime);
  const endIso = formatICSDatetime(event.endDate || event.startDate, event.endTime || '11:30 AM');
  const loc = [event.location.name, event.location.address, event.location.city]
    .filter(Boolean)
    .join(', ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Church of God Subic//Project Nehemiah//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.shortDescription.replace(/\n/g, ' ')}`,
    `LOCATION:${loc}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
