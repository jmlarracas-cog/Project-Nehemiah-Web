import { ContentStatus, ContentMeta } from './about';

export interface MinistryScripture {
  reference: string;
  text?: string;
}

export interface MinistryLeader {
  name: string;
  position?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  status?: ContentStatus;
}

export interface MinistrySchedule {
  day?: string;
  time?: string;
  frequency?: string;
  location?: string;
  notes?: string;
}

export interface MinistryContact {
  email?: string;
  phone?: string;
  location?: string;
}

export interface MinistrySocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface Ministry {
  id: string;
  slug: string;

  name: string;
  shortName?: string;
  tagline?: string;

  category?: string; // e.g., 'Worship', 'Discipleship', 'Outreach', 'Next Generation', 'Relationships', 'Prayer'

  description: string;
  shortDescription?: string;

  imageUrl?: string;
  imageAlt?: string;

  iconName?: string;

  scripture?: MinistryScripture;

  leader?: MinistryLeader;
  leaderRole?: string;

  meetingSchedule?: MinistrySchedule;
  meetingTime?: string;

  ageGroup?: string;

  contact?: MinistryContact;

  socialLinks?: MinistrySocialLinks;

  featured?: boolean;

  highlights?: string[];

  displayOrder?: number;

  status?: ContentStatus;

  meta?: ContentMeta;
}

export interface MinistryCategory {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
}

export interface MinistriesPageData {
  hero: {
    title: string;
    subtitle: string;
    bgImage: string;
    imageAlt: string;
    status: ContentStatus;
  };
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string[];
    scripture: {
      reference: string;
      text: string;
    };
    status: ContentStatus;
  };
  categories: MinistryCategory[];
  ministries: Ministry[];
  cta: {
    title: string;
    subtitle: string;
    primaryAction: { label: string; href: string };
    secondaryAction: { label: string; href: string };
    status: ContentStatus;
  };
  seo: {
    title: string;
    description: string;
    socialImage?: string;
  };
}
