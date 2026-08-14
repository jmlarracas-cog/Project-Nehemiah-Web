import { ContentStatus, ContentMeta } from './about';

export type EventCategory =
  | 'Worship'
  | 'Bible Study'
  | 'Prayer'
  | 'Discipleship'
  | 'Youth'
  | 'Children'
  | 'Outreach'
  | 'Missions'
  | 'Fellowship'
  | 'Conference'
  | 'Retreat'
  | 'Special Event';

export interface EventLocation {
  name: string;
  address?: string;
  city?: string;
  roomOrHall?: string;
  isOnline?: boolean;
  onlineLink?: string;
}

export interface EventContact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface EventRegistration {
  required: boolean;
  isOpen?: boolean;
  registrationUrl?: string;
  fee?: string; // e.g. "Free" or "₱500"
  deadline?: string;
  maxCapacity?: number;
  notes?: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description: string;
  category: EventCategory | string;
  imageUrl: string;
  imageAlt?: string;
  startDate?: string; // ISO format "YYYY-MM-DD" or formatted date "August 15, 2026"
  date?: string;
  endDate?: string;
  startTime?: string; // e.g. "9:00 AM"
  time?: string;
  endTime?: string;  // e.g. "11:30 AM"
  allDay?: boolean;
  location: EventLocation;
  organizer?: string;
  contact?: EventContact;
  registration?: EventRegistration;
  registrationOpen?: boolean;
  featured?: boolean;
  recurring?: boolean;
  recurrenceRule?: string; // e.g. "Every Sunday at 9:00 AM"
  scripture?: {
    reference: string;
    text?: string;
  };
  tags?: string[];
  displayOrder?: number;
  status?: ContentStatus;
  meta?: ContentMeta;
}

export type EventItem = Event;

export interface EventsPageData {
  hero: {
    title: string;
    goldSubtitle?: string;
    subtitle: string;
    bgImage: string;
    imageAlt: string;
    status?: ContentStatus;
  };
  categories: string[];
  events: Event[];
  seo: {
    title: string;
    description: string;
  };
}
