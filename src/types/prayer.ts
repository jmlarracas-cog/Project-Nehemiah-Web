import { ContentStatus, ContentMeta } from './about';

export type PrayerCategory =
  | 'Personal'
  | 'Family'
  | 'Health'
  | 'Work / Finances'
  | 'Relationships'
  | 'Spiritual Growth'
  | 'Church / Ministry'
  | 'Community'
  | 'Thanksgiving'
  | 'Other';

export type PrayerVisibility = 'private' | 'prayer_team' | 'public_consent';

export type PrayerSubmissionStatus = 'new' | 'praying' | 'followed_up' | 'archived';

export interface PrayerRequestSubmission {
  id?: string;
  name?: string;
  isAnonymous: boolean;
  email?: string;
  category: PrayerCategory;
  request: string;
  visibility: PrayerVisibility;
  contactPreference?: 'none' | 'email' | 'phone';
  phone?: string;
  consent: boolean;
  submittedAt?: string;
  status?: PrayerSubmissionStatus;
  assignedTo?: string;
  internalNotes?: string;
}

export interface PrayerFAQItem {
  question: string;
  answer: string;
  status?: ContentStatus;
}

export interface PrayerScripturePassage {
  reference: string;
  text: string;
  theme: string;
}

export interface PrayerPageData {
  hero: {
    title: string;
    goldSubtitle?: string;
    subtitle: string;
    bgImage: string;
    imageAlt: string;
    status?: ContentStatus;
  };
  intro: {
    title: string;
    description: string[];
    status?: ContentStatus;
  };
  scriptures: PrayerScripturePassage[];
  faqs: PrayerFAQItem[];
  privacyNotice: {
    title: string;
    points: string[];
  };
  seo: {
    title: string;
    description: string;
  };
}
