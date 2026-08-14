import { ContentStatus, ContentMeta } from './about';

export interface ContactTopic {
  id: string;
  name: string;
  description: string;
  category?: string;
  status?: ContentStatus;
}

export interface ContactChannel {
  id: string;
  type: 'phone' | 'email' | 'address' | 'office_hours' | 'social';
  label: string;
  value: string;
  hours?: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  consent: boolean;
  createdAt: string;
  status: 'submitted' | 'received';
}

export interface VisitorGuideItem {
  id: string;
  question: string;
  answer: string;
  category: 'arrival' | 'apparel' | 'schedule' | 'parking' | 'children' | 'youth' | 'hospitality' | 'next_steps';
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface VisitService {
  id: string;
  name: string;
  day: string;
  time: string;
  location: string;
  duration: string;
  category: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface VisitInformation {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ContactPageData {
  hero: {
    title: string;
    goldSubtitle: string;
    subtitle: string;
    bgImage: string;
    status: ContentStatus;
    meta?: ContentMeta;
  };
  channels: ContactChannel[];
  topics: ContactTopic[];
  seo: {
    title: string;
    description: string;
  };
}

export interface VisitPageData {
  hero: {
    title: string;
    goldSubtitle: string;
    subtitle: string;
    bgImage: string;
    status: ContentStatus;
    meta?: ContentMeta;
  };
  services: VisitService[];
  guideItems: VisitorGuideItem[];
  expectationBlocks: VisitInformation[];
  seo: {
    title: string;
    description: string;
  };
}
