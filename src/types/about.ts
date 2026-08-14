export type ContentStatus =
  | 'published'
  | 'draft'
  | 'pending_verification'
  | 'archived';

export interface ContentMeta {
  status: ContentStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  scripture?: string;
  status?: ContentStatus;
}

export interface StatementOfFaithData {
  title: string;
  eyebrow: string;
  summary: string;
  paragraphs: string[];
  scriptureReferences: {
    reference: string;
    text: string;
  }[];
  status?: ContentStatus;
}

export interface CoreBelief {
  id: string;
  title: string;
  description: string;
  iconName: string;
  scripture?: string;
  status?: ContentStatus;
}

export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  displayOrder: number;
  status?: ContentStatus;
  meta?: ContentMeta;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  scripture?: string;
  status?: ContentStatus;
  meta?: ContentMeta;
  /** @deprecated use status instead */
  isVerified?: boolean;
}

export interface AboutStatistic {
  id: string;
  value: string;
  label: string;
  description: string;
  iconName: string;
  status?: ContentStatus;
  meta?: ContentMeta;
  /** @deprecated use status instead */
  isVerified?: boolean;
}

export interface AboutPageData {
  hero: {
    title: string;
    goldSubtitle?: string;
    subtitle: string;
    bgImage: string;
    imageAlt: string;
    status?: ContentStatus;
  };

  story: {
    title: string;
    eyebrow: string;
    paragraphs: string[];
    scripture?: {
      quote: string;
      reference: string;
    };
    imageUrl: string;
    imageAlt: string;
    status?: ContentStatus;
    meta?: ContentMeta;
    /** @deprecated use status instead */
    isVerifiedContent?: boolean;
  };

  mission: {
    title: string;
    description: string;
    scripture: string;
    status?: ContentStatus;
  };

  vision: {
    title: string;
    description: string;
    scripture: string;
    status?: ContentStatus;
  };

  values: ValueItem[];

  statementOfFaith: StatementOfFaithData;

  coreBeliefs: CoreBelief[];

  leadership: LeadershipMember[];

  journey: TimelineEvent[];

  statistics: AboutStatistic[];

  cta: {
    title: string;
    subtitle: string;
    primaryAction: { label: string; href: string };
    secondaryAction: { label: string; href: string };
    status?: ContentStatus;
  };

  seo: {
    title: string;
    description: string;
    socialImage?: string;
  };
}
